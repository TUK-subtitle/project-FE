import { useState } from 'react';
import type { MemoEntry } from '@/types/recording';

interface MemoTabProps {
  memos: MemoEntry[];
  onSubmit: (text: string) => Promise<void>;
}

export default function MemoTab({ memos, onSubmit }: MemoTabProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;
      setIsSubmitting(true);
      await onSubmit(trimmed);
      setText('');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col px-[32px] pt-[35px] pb-[24px]">
      <p className="text-[16px] leading-normal font-medium text-black">
        ✍️ 중요한 포인트인가요?
        <br />
        여기에 기록하세요.
      </p>

      {memos.length > 0 && (
        <div className="mt-[24px] flex flex-col gap-[16px]">
          {memos.map((memo, index) => (
            <div key={index}>
              <p className="text-[16px] leading-normal font-bold text-[#c4c4c4]">
                {memo.timestamp}
              </p>
              <p className="text-[16px] leading-normal whitespace-pre-wrap text-black">
                {memo.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <textarea
        className="mt-[24px] flex-1 resize-none text-[15px] text-black outline-none placeholder:text-[#727272]"
        placeholder="메모를 여기에 시작해보세요!"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
    </div>
  );
}
