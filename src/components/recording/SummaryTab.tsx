interface SummaryTabProps {
  summaries: string[];
}

export default function SummaryTab({ summaries }: SummaryTabProps) {
  if (summaries.length === 0) {
    return (
      <div className="px-[32px] pt-[35px]">
        <p className="text-[16px] leading-normal font-medium text-black">
          중요한 내용만
          <br />
          실시간으로 정리해드릴게요! 📝
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px] px-[32px] pt-[35px] pb-[32px]">
      {summaries.map((summary, index) => (
        <div key={index} className="flex flex-col gap-[8px]">
          <p className="text-[12px] font-medium text-[#959595]">{index + 1}분</p>
          <p className="text-[14px] leading-normal font-medium text-black whitespace-pre-wrap">{summary}</p>
        </div>
      ))}
    </div>
  );
}
