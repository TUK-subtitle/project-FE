import axios from 'axios';
import type { MemoEntry } from '@/types/recording';

const API_URL = import.meta.env.VITE_API_URL as string;
const DEFAULT_CONTENT_ID = 1;

interface MemoResponse {
  memoText: string;
  timestamp: string;
}

export async function createMemo(
  memoText: string,
  timestamp: string,
  contentId = DEFAULT_CONTENT_ID,
): Promise<void> {
  await axios.post(`${API_URL}/memo/${contentId}`, { memoText, timestamp });
}

export async function getMemos(
  contentId = DEFAULT_CONTENT_ID,
): Promise<MemoEntry[]> {
  const res = await axios.get<{ data: MemoResponse[] }>(
    `${API_URL}/memo/${contentId}`,
  );

  return (res.data.data ?? []).map((memo) => ({
    timestamp: memo.timestamp,
    content: memo.memoText,
  }));
}
