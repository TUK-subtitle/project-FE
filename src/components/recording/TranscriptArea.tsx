import { useEffect, useRef } from 'react';
import type { TranscriptEntry } from '@/types/recording';
import TranscriptItem from './TranscriptItem';

interface TranscriptAreaProps {
  entries: TranscriptEntry[];
  liveText?: string;
}

export default function TranscriptArea({ entries, liveText }: TranscriptAreaProps) {
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
        <p className="text-[14px] leading-normal font-medium text-[#959595]">
          {liveText}
        </p>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
