// Shared types for the AI Brain workspace.

export type SourceType = 'youtube' | 'website' | 'pdf';

export interface Source {
  id: string;
  type: SourceType;
  url?: string;
  title: string;
  content: string; // transcript / extracted text
  status: 'processing' | 'ready' | 'error';
  progress: number; // 0..100
  stage?: string;
  error?: string;
  author?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ToolType = 'summarize' | 'podcast' | 'chat' | 'brain';

export type ToolIcon = 'summarize' | 'podcast' | 'chat' | 'brain';

export interface ToolMeta {
  id: ToolType;
  title: string;
  description: string;
  icon: ToolIcon;
}

export const TOOLS: ToolMeta[] = [
  {
    id: 'summarize',
    title: 'Summarize Video',
    description: 'Turn any video into a clean, structured summary.',
    icon: 'summarize',
  },
  {
    id: 'podcast',
    title: 'Create Podcast',
    description: 'Repurpose videos into podcast-ready material.',
    icon: 'podcast',
  },
  {
    id: 'chat',
    title: 'Chat with Videos',
    description: 'Ask questions across one or many videos.',
    icon: 'chat',
  },
  {
    id: 'brain',
    title: 'Build an AI System',
    description: 'Reason across every source you have added.',
    icon: 'brain',
  },
];
