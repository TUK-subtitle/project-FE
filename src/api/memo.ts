import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;
const CONTENT_ID = 1;

export async function createMemo(
  memoText: string,
  timestamp: string,
): Promise<void> {
  await axios.post(`${API_URL}/memo/${CONTENT_ID}`, { memoText, timestamp });
}

export async function getMemos(): Promise<
  { memoText: string; timestamp: string }[]
> {
  const res = await axios.get(`${API_URL}/memo/${CONTENT_ID}`);
  return res.data.data ?? [];
}
