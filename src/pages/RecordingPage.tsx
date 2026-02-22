import Sidebar from '@/components/layout/Sidebar';
import NoteHeader from '@/components/recording/NoteHeader';
import TranscriptArea from '@/components/recording/TranscriptArea';
import RightPanel from '@/components/recording/RightPanel';
import RecordingBar from '@/components/recording/RecordingBar';

export default function RecordingPage() {

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
            <TranscriptArea entries={[]} />
          </div>
          <RightPanel memos={[]} defaultTab="summary" />
        </div>
      </div>

      <RecordingBar />
    </div>
  );
}
