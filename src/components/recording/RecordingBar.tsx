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
          className="cursor-pointer rounded-[30px] bg-[#00ec7a] px-[32px] py-[14px] text-[18px] font-semibold text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          onClick={onStart}
        >
          녹음 시작
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
          className={`flex size-[32px] cursor-pointer items-center justify-center rounded-full ${
            !isPaused ? 'border-2 border-white' : 'bg-[#ff4444]'
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
          className="cursor-pointer text-[18px] font-semibold text-white"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          className="cursor-pointer text-[18px] font-semibold text-[#00ec7a]"
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
