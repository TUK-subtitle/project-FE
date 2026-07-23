import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;
const CONTENT_ID = 1;

interface SummaryResultResponse {
  title: string;
  createdAt: string | null;
  summaryText: string;
  minuteSummaries: { text: string; createdAt: string }[];
  memos: {
    id: number;
    contentId: number;
    memoText: string;
    timestamp: string;
  }[];
}

export async function requestFinalSummary(title?: string): Promise<void> {
  await axios.post(`${API_URL}/api/summary/end/${CONTENT_ID}`, null, {
    params: title ? { title } : undefined,
  });
}

export async function getFinalSummary(): Promise<string> {
  const res = await axios.get<{ data: SummaryResultResponse }>(
    `${API_URL}/api/summary/${CONTENT_ID}`,
  );

  return res.data.data?.summaryText ?? '';
}
