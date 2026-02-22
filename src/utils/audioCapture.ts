const SAMPLE_RATE = 16000;
const CHUNK_INTERVAL_MS = 100;

export interface AudioCapture {
  start: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export function createAudioCapture(
  onChunk: (pcmData: ArrayBuffer) => void,
): AudioCapture {
  let stream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;
  let workletNode: AudioWorkletNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let paused = false;

  async function start() {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: SAMPLE_RATE,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });

    // AudioWorklet으로 PCM 변환
    const processorCode = `
      class PcmProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
          this._buffer = [];
          this._chunkSize = ${Math.floor(SAMPLE_RATE * CHUNK_INTERVAL_MS / 1000)};
        }

        process(inputs) {
          const input = inputs[0];
          if (!input || !input[0]) return true;

          const samples = input[0];
          for (let i = 0; i < samples.length; i++) {
            this._buffer.push(samples[i]);
          }

          while (this._buffer.length >= this._chunkSize) {
            const chunk = this._buffer.splice(0, this._chunkSize);
            const int16 = new Int16Array(chunk.length);
            for (let i = 0; i < chunk.length; i++) {
              const s = Math.max(-1, Math.min(1, chunk[i]));
              int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }
            this.port.postMessage(int16.buffer, [int16.buffer]);
          }

          return true;
        }
      }
      registerProcessor('pcm-processor', PcmProcessor);
    `;

    const blob = new Blob([processorCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    await audioContext.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);

    source = audioContext.createMediaStreamSource(stream);
    workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');

    workletNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      if (!paused) {
        onChunk(e.data);
      }
    };

    source.connect(workletNode);
    workletNode.connect(audioContext.destination);
  }

  function stop() {
    workletNode?.disconnect();
    source?.disconnect();
    audioContext?.close();
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    audioContext = null;
    workletNode = null;
    source = null;
    paused = false;
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
  }

  return { start, stop, pause, resume };
}
