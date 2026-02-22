import { useEffect, useRef } from 'react';
import { MdPerson } from 'react-icons/md';
import type { TranscriptEntry } from '@/types/recording';
import TranscriptItem from './TranscriptItem';

interface TranscriptAreaProps {
  entries: TranscriptEntry[];
  liveText?: string;
  liveTimestamp?: string;
}

export default function TranscriptArea({ entries, liveText, liveTimestamp }: TranscriptAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, liveText]);

  if (entries.length === 0 && !liveText) {
    return (
      <div className="px-[71px] pt-[38px]">
        <p className="text-[16px] leading-normal text-[#959595]">
          녹음을 시작해보세요.
          <br />
          SpeakView가 실시간으로 자막을 만들어드려요!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px] px-[71px] pt-[38px] pb-[120px]">
      {entries.map((entry, index) => (
        <TranscriptItem key={index} entry={entry} />
      ))}
      {liveText && (
        <div className="flex flex-col gap-[8px]">
          <p className="text-[16px] leading-normal font-bold text-[#c4c4c4]">
            {liveTimestamp}
          </p>
          <div className="flex gap-[16px]">
            <div className="flex shrink-0 flex-col items-center gap-[2px]">
              <MdPerson size={24} className="text-[#4A90D9]" />
              <span className="text-[10px] font-medium text-[#4A90D9]">
                참석자 1
              </span>
            </div>
            <p className="text-[14px] leading-normal font-medium whitespace-pre-wrap text-[#4A90D9]">
              {liveText}
            </p>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
