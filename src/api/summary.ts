import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;
const DEFAULT_CONTENT_ID = 1;

export interface MinuteSummary {
  text: string;
  createdAt: string;
}

export interface SummaryResultResponse {
  title: string;
  createdAt: string | null;
  summaryText: string;
  minuteSummaries: MinuteSummary[];
  memos: {
    id: number;
    contentId: number;
    memoText: string;
    timestamp: string;
  }[];
}

export async function requestFinalSummary(
  title?: string,
  contentId = DEFAULT_CONTENT_ID,
): Promise<void> {
  await axios.post(`${API_URL}/api/summary/end/${contentId}`, null, {
    params: title ? { title } : undefined,
  });
}

export async function getSummaryResult(
  contentId = DEFAULT_CONTENT_ID,
): Promise<SummaryResultResponse | null> {
  const res = await axios.get<{ data: SummaryResultResponse }>(
    `${API_URL}/api/summary/${contentId}`,
  );

  return res.data.data ?? null;
}

export async function getFinalSummary(
  contentId = DEFAULT_CONTENT_ID,
): Promise<string> {
  const summary = await getSummaryResult(contentId);
  return summary?.summaryText ?? '';
}
