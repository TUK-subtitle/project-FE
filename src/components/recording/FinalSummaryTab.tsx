interface FinalSummaryTabProps {
  summary: string;
  isLoading: boolean;
}

export default function FinalSummaryTab({
  summary,
  isLoading,
}: FinalSummaryTabProps) {
  if (isLoading) {
    return (
      <div className="px-[71px] pt-[38px]">
        <p className="text-[16px] leading-normal font-medium text-[#727272]">
          전체 요약을 생성하고 있어요.
          <br />
          잠시만 기다려주세요.
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="px-[71px] pt-[38px]">
        <p className="text-[16px] leading-normal font-medium text-[#727272]">
          녹음을 종료하면
          <br />
          전체 요약이 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="px-[71px] pt-[38px] pb-[120px]">
      <p className="whitespace-pre-wrap text-[16px] leading-[1.7] font-medium text-black">
        {summary}
      </p>
    </div>
  );
}
