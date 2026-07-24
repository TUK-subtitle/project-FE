import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import Sidebar from '@/components/layout/Sidebar';
import NoteHeader from '@/components/recording/NoteHeader';
import FinalSummaryTab from '@/components/recording/FinalSummaryTab';
import RightPanel from '@/components/recording/RightPanel';
import { createMemo, getMemos } from '@/api/memo';
import { getSummaryResult } from '@/api/summary';
import {
  getTranscriptDetail,
  type LectureAudio,
  type TranscriptToken,
} from '@/api/transcript';
import type { MemoEntry } from '@/types/recording';

type MainTab = 'transcript' | 'summary';

interface NoteDetailLocationState {
  subject?: string;
  title?: string;
}

interface TranscriptSegment {
  id: string;
  speaker: number;
  startMs: number;
  endMs: number;
  text: string;
}

const API_URL = import.meta.env.VITE_API_URL as string;

function formatCurrentDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${d}`;
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function resolveAudioSrc(audio: LectureAudio | null): string {
  if (!audio?.audioUrl) return '';
  if (audio.audioUrl.startsWith('http')) return audio.audioUrl;
  return `${API_URL}${audio.audioUrl}`;
}

function buildSegments(tokens: TranscriptToken[]): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  let current: TranscriptSegment | null = null;

  tokens.forEach((token) => {
    const startMs = token.startMs ?? current?.endMs ?? 0;
    const endMs = token.endMs ?? startMs;
    const shouldStartNew =
      !current ||
      current.speaker !== token.speaker ||
      startMs - current.endMs > 3000 ||
      current.text.length > 90;

    if (shouldStartNew) {
      current = {
        id: String(token.tokenId),
        speaker: token.speaker,
        startMs,
        endMs,
        text: token.text,
      };
      segments.push(current);
      return;
    }

    if (!current) return;

    const activeSegment = current;
    activeSegment.text = `${activeSegment.text}${token.text}`;
    activeSegment.endMs = Math.max(activeSegment.endMs, endMs);
  });

  return segments;
}

export default function NoteDetailPage() {
  const { contentId } = useParams();
  const location = useLocation();
  const routeState = location.state as NoteDetailLocationState | null;
  const numericContentId = Number(contentId);

  const [activeMainTab, setActiveMainTab] = useState<MainTab>('transcript');
  const [audio, setAudio] = useState<LectureAudio | null>(null);
  const [tokens, setTokens] = useState<TranscriptToken[]>([]);
  const [noteTitle, setNoteTitle] = useState(routeState?.title ?? '저장된 노트');
  const [noteFolder] = useState(routeState?.subject ?? '폴더 위치');
  const [finalSummary, setFinalSummary] = useState('');
  const [summaries, setSummaries] = useState<string[]>([]);
  const [memos, setMemos] = useState<MemoEntry[]>([]);
  const [currentMs, setCurrentMs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const segments = useMemo(() => buildSegments(tokens), [tokens]);
  const activeSegmentId = useMemo(() => {
    const active = segments.find(
      (segment) => currentMs >= segment.startMs && currentMs <= segment.endMs,
    );
    return active?.id ?? '';
  }, [currentMs, segments]);

  useEffect(() => {
    if (!Number.isFinite(numericContentId)) {
      setErrorMessage('올바른 노트 ID가 아닙니다.');
      setIsLoading(false);
      return;
    }

    const loadNote = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [transcript, summary, savedMemos] = await Promise.all([
          getTranscriptDetail(numericContentId),
          getSummaryResult(numericContentId),
          getMemos(numericContentId),
        ]);

        setAudio(transcript.audio);
        setTokens(transcript.tokens);
        setNoteTitle(summary?.title || routeState?.title || '저장된 노트');
        setFinalSummary(summary?.summaryText ?? '');
        setSummaries(summary?.minuteSummaries.map((item) => item.text) ?? []);
        setMemos(savedMemos);
      } catch (error) {
        console.error('[NoteDetail] 저장 노트 조회 실패:', error);
        setErrorMessage('저장된 노트를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadNote();
  }, [numericContentId, routeState?.title]);

  const handleMemoSubmit = useCallback(
    async (text: string) => {
      const timestamp = formatMs(currentMs);
      await createMemo(text, timestamp, numericContentId);
      setMemos((prev) => [...prev, { timestamp, content: text }]);
    },
    [currentMs, numericContentId],
  );

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative">
          <Link
            to="/mypage"
            className="absolute top-[32px] left-[24px] flex size-[32px] items-center justify-center rounded-full text-[#727272] hover:bg-[#f4f4f4] hover:text-black"
            aria-label="마이페이지로 돌아가기"
          >
            <MdArrowBack size={20} />
          </Link>
          <NoteHeader
            title={noteTitle}
            date={formatCurrentDate()}
            folder={noteFolder}
            showActions={false}
          />
        </div>
        <div className="mt-[15px] border-t border-[#c4c4c4]" />

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

            {activeMainTab === 'transcript' ? (
              <div className="flex min-h-0 flex-1 flex-col">
                {isLoading ? (
                  <div className="min-h-0 flex-1 overflow-y-auto px-[71px] pt-[28px] pb-[120px]">
                  <p className="text-[16px] font-medium text-[#727272]">
                    저장된 노트를 불러오는 중입니다.
                  </p>
                  </div>
                ) : errorMessage ? (
                  <div className="min-h-0 flex-1 overflow-y-auto px-[71px] pt-[28px] pb-[120px]">
                  <p className="text-[16px] font-medium text-[#ff5b5b]">
                    {errorMessage}
                  </p>
                  </div>
                ) : (
                  <>
                    <section className="z-20 shrink-0 border-b border-[#ececec] bg-white px-[71px] pt-[20px] pb-[20px]">
                      {audio ? (
                        <audio
                          ref={audioRef}
                          className="w-full"
                          controls
                          src={resolveAudioSrc(audio)}
                          onTimeUpdate={(event) =>
                            setCurrentMs(event.currentTarget.currentTime * 1000)
                          }
                        />
                      ) : (
                        <p className="text-[15px] font-medium text-[#959595]">
                          저장된 오디오가 없습니다.
                        </p>
                      )}
                      <div className="mt-[10px] flex items-center justify-between text-[12px] font-medium text-[#959595]">
                        <span>{formatMs(currentMs)}</span>
                        <span>
                          {audio?.durationMs ? formatMs(audio.durationMs) : '--:--'}
                        </span>
                      </div>
                    </section>

                    <div className="min-h-0 flex-1 overflow-y-auto px-[71px] pt-[28px] pb-[120px]">
                      {segments.length === 0 ? (
                        <p className="text-[16px] font-medium text-[#727272]">
                          저장된 자막이 없습니다.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-[18px]">
                          {segments.map((segment) => (
                            <button
                              key={segment.id}
                              className={`w-full rounded-[8px] px-[16px] py-[14px] text-left transition-colors ${
                                activeSegmentId === segment.id
                                  ? 'bg-[#edf5f1]'
                                  : 'bg-white hover:bg-[#fafafa]'
                              }`}
                              onClick={() => {
                                if (audioRef.current) {
                                  audioRef.current.currentTime =
                                    segment.startMs / 1000;
                                }
                              }}
                            >
                              <p className="mb-[8px] text-[13px] font-bold text-[#c4c4c4]">
                                {formatMs(segment.startMs)}
                              </p>
                              <div className="flex gap-[14px]">
                                <span className="shrink-0 text-[12px] font-bold text-[#00d56e]">
                                  참석자 {segment.speaker}
                                </span>
                                <p className="text-[15px] leading-[1.7] font-medium whitespace-pre-wrap text-black">
                                  {segment.text}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <FinalSummaryTab summary={finalSummary} isLoading={isLoading} />
              </div>
            )}
          </div>

          <RightPanel
            memos={memos}
            summaries={summaries}
            onMemoSubmit={handleMemoSubmit}
            defaultTab="memo"
          />
        </div>
      </div>
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
