import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface ContentItem {
  id: number;
  title: string;
  createdAt: string;
}

export async function createContent(
  userId: number,
  subjectId: number,
): Promise<number> {
  const res = await axios.post<{ data: number }>(`${API_URL}/api/contents`, {
    userId,
    subjectId,
  });

  return res.data.data;
}

export async function getContents(
  userId: number,
  subjectName?: string,
): Promise<ContentItem[]> {
  const res = await axios.get<{ data: ContentItem[] }>(
    `${API_URL}/api/contents`,
    {
      params: {
        userId,
        subjectName,
      },
    },
  );

  return res.data.data ?? [];
}
