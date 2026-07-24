import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface LectureAudio {
  audioUrl: string;
  format: string;
  sampleRate: number;
  channels: number;
  durationMs: number;
}

export interface TranscriptToken {
  tokenId: number;
  seq: number;
  text: string;
  speaker: number;
  startMs: number | null;
  endMs: number | null;
  confidence: number | null;
}

export interface TranscriptDetail {
  contentId: number;
  fullText: string;
  tokenCount: number;
  audio: LectureAudio | null;
  tokens: TranscriptToken[];
}

export async function getTranscriptDetail(
  contentId: number,
): Promise<TranscriptDetail> {
  const res = await axios.get<{ data: TranscriptDetail }>(
    `${API_URL}/api/contents/${contentId}/transcript`,
  );

  return res.data.data;
}
