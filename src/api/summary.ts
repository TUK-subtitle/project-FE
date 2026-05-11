import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;
const CONTENT_ID = 1;

export async function requestFinalSummary(): Promise<void> {
  await axios.post(`${API_URL}/api/summary/end/${CONTENT_ID}`);
}

export async function getFinalSummary(): Promise<string> {
  const res = await axios.get(`${API_URL}/api/summary/${CONTENT_ID}`);
  return res.data.data ?? '';
}
