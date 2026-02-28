import { MdPause, MdMic } from 'react-icons/md';

interface RecordingBarProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onTogglePause: () => void;
  onStop: () => void;
  onCancel: () => void;
}

export default function RecordingBar({
  isRecording,
  isPaused,
  onStart,
  onTogglePause,
  onStop,
  onCancel,
}: RecordingBarProps) {
  if (!isRecording) {
    return (
      <div className="fixed bottom-[63px] left-1/2 z-50 -translate-x-1/2">
        <button
          className="group relative flex cursor-pointer items-center gap-[10px] overflow-hidden rounded-full border border-white/30 bg-gradient-to-r from-[#00d86f] via-[#00ec7a] to-[#20f0b0] px-[34px] py-[14px] text-[18px] font-semibold text-white shadow-[0_12px_26px_rgba(0,236,122,0.45)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_16px_34px_rgba(0,236,122,0.55)] active:translate-y-0 active:shadow-[0_10px_20px_rgba(0,236,122,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
          onClick={onStart}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.35),transparent_40%)]" />
          <span className="pointer-events-none absolute -left-[34%] top-0 h-full w-[28%] -skew-x-12 bg-white/25 blur-[1px] transition-transform duration-500 group-hover:translate-x-[420%]" />
          <MdMic size={20} className="relative" />
          <span className="relative">녹음 시작</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[63px] left-1/2 z-50 flex h-[60px] w-[551px] -translate-x-1/2 items-center justify-between rounded-[30px] bg-[#3a3a3a] px-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-[16px]">
        <Waveform animated={!isPaused} />
        <span className="text-[18px] text-white">
          {isPaused ? '일시정지 중...' : '녹음 중...'}
        </span>
      </div>

      <div className="flex items-center gap-[16px]">
        <button
          className={`flex size-[34px] cursor-pointer items-center justify-center rounded-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a3a3a] ${
            !isPaused
              ? 'border-2 border-white bg-transparent hover:bg-white/12'
              : 'bg-[#ff4444] hover:bg-[#ff5b5b]'
          }`}
          onClick={onTogglePause}
        >
          {!isPaused ? (
            <MdPause size={20} className="text-white" />
          ) : (
            <MdMic size={20} className="text-white" />
          )}
        </button>
        <div className="h-[35px] w-px bg-white/40" />
        <button
          className="cursor-pointer rounded-full bg-white/5 px-[14px] py-[6px] text-[17px] font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/14 hover:shadow-[0_8px_18px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a3a3a]"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          className="cursor-pointer rounded-full bg-[#00ec7a]/12 px-[14px] py-[6px] text-[17px] font-semibold text-[#00ec7a] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-[#00ec7a]/22 hover:text-[#2cff9c] hover:shadow-[0_10px_24px_rgba(0,236,122,0.28)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ec7a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a3a3a]"
          onClick={onStop}
        >
          종료
        </button>
      </div>
    </div>
  );
}

const WAVE_BARS = [
  { height: 18, delay: 0.1, duration: 0.7 },
  { height: 28, delay: 0.2, duration: 0.8 },
  { height: 22, delay: 0.3, duration: 0.6 },
  { height: 30, delay: 0.4, duration: 0.9 },
  { height: 16, delay: 0.5, duration: 0.7 },
  { height: 26, delay: 0.6, duration: 0.8 },
  { height: 20, delay: 0.7, duration: 0.6 },
  { height: 24, delay: 0.8, duration: 0.9 },
];

function Waveform({ animated }: { animated: boolean }) {
  return (
    <div className="flex items-center gap-[3px]">
      {WAVE_BARS.map((bar, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-[#00ec7a] ${animated ? 'animate-pulse' : ''}`}
          style={{
            height: `${bar.height}px`,
            animationDelay: animated ? `${bar.delay}s` : undefined,
            animationDuration: animated ? `${bar.duration}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}
