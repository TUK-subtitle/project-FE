import { useState, useRef, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import NoteHeader from '@/components/recording/NoteHeader';
import TranscriptArea from '@/components/recording/TranscriptArea';
import RightPanel from '@/components/recording/RightPanel';
import RecordingBar from '@/components/recording/RecordingBar';
import { useSocket } from '@/hooks/useSocket';
import { createAudioCapture, type AudioCapture } from '@/utils/audioCapture';
import type { TranscriptEntry } from '@/types/recording';

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

export default function RecordingPage() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [liveText, setLiveText] = useState('');
  const [liveTimestamp, setLiveTimestamp] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const audioCaptureRef = useRef<AudioCapture | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  const pauseStartRef = useRef<number>(0);

  const getElapsed = useCallback(() => {
    const paused = isPaused
      ? pausedDurationRef.current + (Date.now() - pauseStartRef.current)
      : pausedDurationRef.current;
    return Date.now() - startTimeRef.current - paused;
  }, [isPaused]);

  const { sendAudio, connect, disconnect } = useSocket(
    // onSubtitleLive
    (text) => {
      setLiveText(text);
      setLiveTimestamp((prev) => prev || formatElapsed(getElapsed()));
    },
    // onSubtitleFinal
    (text) => {
      const elapsed = getElapsed();
      setEntries((prev) => [
        ...prev,
        {
          timestamp: formatElapsed(elapsed),
          speaker: '참석자 1',
          speakerType: 'host',
          text,
        },
      ]);
      setLiveText('');
      setLiveTimestamp('');
    },
  );

  const handleStart = useCallback(async () => {
    connect();

    const capture = createAudioCapture((pcmData) => {
      sendAudio(pcmData);
    });
    await capture.start();
    audioCaptureRef.current = capture;

    startTimeRef.current = Date.now();
    pausedDurationRef.current = 0;
    setIsRecording(true);
    setIsPaused(false);
    setEntries([]);
    setLiveText('');
  }, [connect, sendAudio]);

  const handleTogglePause = useCallback(() => {
    if (!audioCaptureRef.current) return;

    if (isPaused) {
      pausedDurationRef.current += Date.now() - pauseStartRef.current;
      audioCaptureRef.current.resume();
      setIsPaused(false);
    } else {
      pauseStartRef.current = Date.now();
      audioCaptureRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  const handleStop = useCallback(() => {
    audioCaptureRef.current?.stop();
    audioCaptureRef.current = null;
    disconnect();
    setIsRecording(false);
    setIsPaused(false);
    setLiveText('');
  }, [disconnect]);

  const handleCancel = useCallback(() => {
    audioCaptureRef.current?.stop();
    audioCaptureRef.current = null;
    disconnect();
    setIsRecording(false);
    setIsPaused(false);
    setEntries([]);
    setLiveText('');
  }, [disconnect]);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 상단 헤더 영역 - 전체 너비 */}
        <NoteHeader
          title="새로운 노트"
          date="2026. 02. 01 (금) 오후 3:30"
          folder="전체 노트"
        />
        <div className="mt-[20px] border-t border-[#c4c4c4]" />

        {/* 하단 분할 영역 */}
        <div className="flex min-h-0 flex-1">
          <div className="flex-1 overflow-y-auto">
            <TranscriptArea
              entries={entries}
              liveText={liveText}
              liveTimestamp={liveTimestamp}
            />
          </div>
          <RightPanel memos={[]} defaultTab="summary" />
        </div>
      </div>

      <RecordingBar
        isRecording={isRecording}
        isPaused={isPaused}
        onStart={handleStart}
        onTogglePause={handleTogglePause}
        onStop={handleStop}
        onCancel={handleCancel}
      />
    </div>
  );
}
