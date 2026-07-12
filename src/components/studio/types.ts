// Shared types for the Studio UI. Kept in one place so components stay modular.

export interface VideoData {
  url: string;
  videoId: string;
  title: string;
  author: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  transcript: string | null;
  language: string | null;
  chapters: { start_time: number; title: string }[];
}

export interface SummaryResult {
  short: string;
  detailed: string;
  keyTakeaways: string[];
  timestamps: { t: number; label: string }[];
  actionItems: string[];
}

export interface PodcastResult {
  notes: string;
  episodeSummary: string;
  discussionPoints: string[];
  highlights: string[];
}

export interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

export interface BrainVideo {
  url: string;
  title: string | null;
  transcript: string | null;
}
