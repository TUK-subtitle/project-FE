import type { MemoEntry } from '@/types/recording';

interface MemoTabProps {
  memos: MemoEntry[];
}

export default function MemoTab({ memos }: MemoTabProps) {
  if (memos.length === 0) {
    return (
      <div className="px-[32px] pt-[35px]">
        <p className="text-[16px] leading-normal font-medium text-black">
          ✍️ 중요한 포인트인가요?
          <br />
          여기에 기록하세요.
        </p>
        <p className="mt-[24px] text-center text-[15px] text-[#727272]">
          메모를 여기에 시작해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] px-[35px] pt-[26px]">
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
  );
}
