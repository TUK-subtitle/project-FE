import { useState, useRef, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import NoteHeader from '@/components/recording/NoteHeader';
import TranscriptArea from '@/components/recording/TranscriptArea';
import RightPanel from '@/components/recording/RightPanel';
import RecordingBar from '@/components/recording/RecordingBar';
import { useSocket, type SubtitlePayload } from '@/hooks/useSocket';
import { createAudioCapture, type AudioCapture } from '@/utils/audioCapture';
import type { TranscriptEntry, MemoEntry } from '@/types/recording';
import { createMemo } from '@/api/memo';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function formatCurrentDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const day = DAY_NAMES[now.getDay()];
  const hour = now.getHours();
  const ampm = hour < 12 ? '오전' : '오후';
  const h12 = hour % 12 || 12;
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${y}. ${m}. ${d} (${day}) ${ampm} ${h12}:${min}`;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

export default function RecordingPage() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [memos, setMemos] = useState<MemoEntry[]>([]);
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
    ({ text, speaker }: SubtitlePayload) => {
      const speakerName = `참석자 ${speaker}`;
      setEntries((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].speaker === speakerName) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: updated[updated.length - 1].text + text,
          };
          return updated;
        }
        return [
          ...prev,
          {
            timestamp: formatElapsed(getElapsed()),
            speaker: speakerName,
            speakerType: 'host',
            text,
          },
        ];
      });
    },
    (text) => {
      setSummaries((prev) => [...prev, text]);
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
  }, [disconnect]);

  const handleCancel = useCallback(() => {
    audioCaptureRef.current?.stop();
    audioCaptureRef.current = null;
    disconnect();
    setIsRecording(false);
    setIsPaused(false);
    setEntries([]);
  }, [disconnect]);

  const handleMemoSubmit = useCallback(
    async (text: string) => {
      const elapsed = Math.floor(getElapsed() / 1000);
      const timestamp = formatElapsed(elapsed * 1000);
      await createMemo(text, timestamp);
      setMemos((prev) => [
        ...prev,
        { timestamp, content: text },
      ]);
    },
    [getElapsed],
  );

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 상단 헤더 영역 - 전체 너비 */}
        <NoteHeader
          title="새로운 노트"
          date={formatCurrentDate()}
          folder="전체 노트"
        />
        <div className="mt-[15px] border-t border-[#c4c4c4]" />

        {/* 하단 분할 영역 */}
        <div className="flex min-h-0 flex-1">
          <div className="flex-1 overflow-y-auto">
            <TranscriptArea entries={entries} />
          </div>
          <RightPanel
            memos={memos}
            summaries={summaries}
            onMemoSubmit={handleMemoSubmit}
            defaultTab="summary"
          />
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
