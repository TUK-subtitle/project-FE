import { useState } from 'react';
import type { MemoEntry } from '@/types/recording';
import SummaryTab from './SummaryTab';
import MemoTab from './MemoTab';

type Tab = 'summary' | 'memo';

interface RightPanelProps {
  memos: MemoEntry[];
  defaultTab?: Tab;
}

export default function RightPanel({
  memos,
  defaultTab = 'summary',
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  return (
    <div className="flex h-full w-[414px] shrink-0 flex-col border-l border-[#c4c4c4]">
      {/* 탭 헤더 */}
      <div className="flex border-b border-[#c4c4c4]">
        <div
          className={`flex flex-1 items-center justify-center py-[16px] ${
            activeTab === 'summary' ? 'border-b-2 border-black' : ''
          }`}
        >
          <button
            className={`cursor-pointer text-[16px] leading-normal font-bold ${
              activeTab === 'summary' ? 'text-black' : 'text-[#c4c4c4]'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            실시간 요약
          </button>
        </div>
        <div
          className={`flex flex-1 items-center justify-center py-[16px] ${
            activeTab === 'memo' ? 'border-b-2 border-black' : ''
          }`}
        >
          <button
            className={`cursor-pointer text-[16px] leading-normal font-bold ${
              activeTab === 'memo' ? 'text-black' : 'text-[#c4c4c4]'
            }`}
            onClick={() => setActiveTab('memo')}
          >
            메모 작성
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'summary' ? <SummaryTab /> : <MemoTab memos={memos} />}
      </div>
    </div>
  );
}
