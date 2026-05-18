import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import NoteHeader from '@/components/recording/NoteHeader';
import TranscriptArea from '@/components/recording/TranscriptArea';
import RightPanel from '@/components/recording/RightPanel';
import RecordingBar from '@/components/recording/RecordingBar';
import FinalSummaryTab from '@/components/recording/FinalSummaryTab';
import { useSocket, type SubtitlePayload } from '@/hooks/useSocket';
import { createAudioCapture, type AudioCapture } from '@/utils/audioCapture';
import type { TranscriptEntry, MemoEntry } from '@/types/recording';
import { createMemo } from '@/api/memo';
import { getFinalSummary, requestFinalSummary } from '@/api/summary';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
type MainTab = 'transcript' | 'summary';
interface RecordingLocationState {
  subject?: string;
  title?: string;
}
const FINAL_SUMMARY_PENDING_TEXT =
  '아직 최종 요약본이 생성되지 않았거나 해당 강의를 찾을 수 없습니다.';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

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
  const location = useLocation();
  const routeState = location.state as RecordingLocationState | null;
  const initialNoteTitle = routeState?.title ?? '';
  const noteFolder = routeState?.subject ?? '폴더 위치';
  const [noteTitle, setNoteTitle] = useState(initialNoteTitle);
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [memos, setMemos] = useState<MemoEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('transcript');
  const [finalSummary, setFinalSummary] = useState('');
  const [isFinalSummaryLoading, setIsFinalSummaryLoading] = useState(false);

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
    setFinalSummary('');
    setIsFinalSummaryLoading(false);
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

  const loadFinalSummary = useCallback(async () => {
    setIsFinalSummaryLoading(true);

    try {
      await wait(500);
      await requestFinalSummary();

      for (let attempt = 0; attempt < 10; attempt += 1) {
        const summary = await getFinalSummary();

        if (summary && summary !== FINAL_SUMMARY_PENDING_TEXT) {
          setFinalSummary(summary);
          return;
        }

        if (attempt < 9) {
          await wait(2000);
        }
      }

      setFinalSummary(FINAL_SUMMARY_PENDING_TEXT);
    } catch (error) {
      console.error('[Summary] 전체 요약 조회 실패:', error);
      setFinalSummary('전체 요약을 불러오지 못했습니다.');
    } finally {
      setIsFinalSummaryLoading(false);
    }
  }, []);

  const handleStop = useCallback(() => {
    audioCaptureRef.current?.stop();
    audioCaptureRef.current = null;
    setActiveMainTab('summary');
    disconnect();
    void loadFinalSummary();
    setIsRecording(false);
    setIsPaused(false);
  }, [disconnect, loadFinalSummary]);

  const handleCancel = useCallback(() => {
    audioCaptureRef.current?.stop();
    audioCaptureRef.current = null;
    disconnect();
    setIsRecording(false);
    setIsPaused(false);
    setEntries([]);
    setFinalSummary('');
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
          title={noteTitle}
          onTitleChange={setNoteTitle}
          date={formatCurrentDate()}
          folder={noteFolder}
        />
        <div className="mt-[15px] border-t border-[#c4c4c4]" />

        {/* 하단 분할 영역 */}
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-[56px] shrink-0 border-b border-[#c4c4c4]">
              <MainTabButton
                active={activeMainTab === 'transcript'}
                onClick={() => setActiveMainTab('transcript')}
              >
                음성 스크립트
              </MainTabButton>
              <MainTabButton
                active={activeMainTab === 'summary'}
                onClick={() => setActiveMainTab('summary')}
              >
                전체 요약
              </MainTabButton>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {activeMainTab === 'transcript' ? (
                <TranscriptArea entries={entries} />
              ) : (
                <FinalSummaryTab
                  summary={finalSummary}
                  isLoading={isFinalSummaryLoading}
                />
              )}
            </div>
          </div>
          <RightPanel
            memos={memos}
            summaries={summaries}
            onMemoSubmit={handleMemoSubmit}
            defaultTab="summary"
          />
        </div>
      </div>

      {!finalSummary && (
        <RecordingBar
          isRecording={isRecording}
          isPaused={isPaused}
          onStart={handleStart}
          onTogglePause={handleTogglePause}
          onStop={handleStop}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

function MainTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex w-[263px] items-center justify-center ${
        active ? 'border-b-2 border-black' : ''
      }`}
    >
      <button
        className={`cursor-pointer text-[16px] leading-normal font-bold transition-colors ${
          active ? 'text-black' : 'text-[#c4c4c4] hover:text-[#727272]'
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
