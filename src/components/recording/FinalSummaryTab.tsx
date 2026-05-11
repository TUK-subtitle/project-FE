import ReactMarkdown from 'react-markdown';

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
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-[18px] text-[24px] leading-[1.5] font-bold text-black">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-[28px] mb-[12px] text-[21px] leading-[1.5] font-bold text-black">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-[22px] mb-[10px] text-[18px] leading-[1.5] font-bold text-black">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-[12px] text-[16px] leading-[1.7] font-medium text-black">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-[16px] list-disc pl-[24px] text-[16px] leading-[1.7] font-medium text-black">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-[16px] list-decimal pl-[24px] text-[16px] leading-[1.7] font-medium text-black">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-[4px]">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-black">{children}</strong>
          ),
        }}
      >
        {summary}
      </ReactMarkdown>
    </div>
  );
}
