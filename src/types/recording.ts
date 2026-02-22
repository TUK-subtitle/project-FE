export interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  speakerType: 'host' | 'guest';
  text: string;
}

export interface MemoEntry {
  timestamp: string;
  content: string;
}
