// Core data model types for Second Brain AI

export type SourceType =
  | 'youtube'
  | 'podcast'
  | 'article'
  | 'webpage'
  | 'pdf'
  | 'document'
  | 'text';

export type SummaryFormat =
  | 'quick'
  | 'five_key_points'
  | 'detailed_notes'
  | 'beginner'
  | 'actionable'
  | 'executive';

export interface ContentObject {
  id: string;
  user_id: string;
  source_url: string;
  source_type: SourceType;
  title: string;
  description: string | null;
  author: string | null;
  duration_seconds: number | null;
  transcript: string | null;
  summary: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
  speaker?: string;
}

export interface Chapter {
  start_time: number;
  title: string;
}

export interface YouTubeMetadata {
  videoId: string;
  title: string;
  description: string;
  author: string;
  duration_seconds: number;
  published_at: string;
  thumbnail_url: string;
  chapters: Chapter[];
  segments: TranscriptSegment[];
}

export interface ImportJobResult {
  success: boolean;
  content_id?: string;
  error?: string;
}
