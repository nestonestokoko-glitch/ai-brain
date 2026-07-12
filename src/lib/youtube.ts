import { google, youtube_v3 } from 'googleapis';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY,
});

export async function extractVideoId(url: string): Promise<string | null> {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export async function fetchVideoMetadata(videoId: string): Promise<youtube_v3.Schema$Video | null> {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return null;
  }
}

export async function fetchVideoTranscript(videoId: string): Promise<string | null> {
  try {
    // Note: YouTube doesn't provide a direct transcript API.
    // You need to use the YouTube Data API's captions.list and captions.download
    // Or use a third-party service like youtube-transcript-api

    // For now, we'll use the captions approach
    // First check if captions exist
    const captionsResponse = await youtube.captions.list({
      part: ['snippet'],
      videoId,
    });

    if (!captionsResponse.data.items || captionsResponse.data.items.length === 0) {
      return null;
    }

    // Download the first available caption (usually auto-generated)
    const captionId = captionsResponse.data.items[0].id;
    if (!captionId) return null;

    const downloadResponse = await youtube.captions.download({
      id: captionId,
      tfmt: 'srt', // SubRip format
    });

    return downloadResponse.data as string;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

export async function fetchVideoChapters(videoId: string): Promise<Array<{ start_time: number; title: string }>> {
  try {
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video?.snippet?.description) return [];

    // Parse chapters from description
    // Chapters are typically formatted as:
    // 0:00 Introduction
    // 1:30 Main Topic
    // etc.
    const chapters: Array<{ start_time: number; title: string }> = [];
    const lines = video.snippet.description.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(.+)$/);
      if (match) {
        const hours = parseInt(match[1] || '0');
        const minutes = parseInt(match[2] || '0');
        const seconds = parseInt(match[3] || '0');
        const title = match[4].trim();

        const start_time = hours * 3600 + minutes * 60 + seconds;
        chapters.push({ start_time, title });
      }
    }

    return chapters;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

export async function parseTranscriptSrt(srtText: string): Promise<Array<{ start: number; duration: number; text: string }>> {
  const segments: Array<{ start: number; duration: number; text: string }> = [];

  const blocks = srtText.trim().split('\n\n');

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;

    // Line 1: segment number (ignore)
    // Line 2: timestamp --> timestamp
    // Line 3+: text

    const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
    if (!timeMatch) continue;

    const startStr = timeMatch[1];
    const endStr = timeMatch[2];

    const parseTime = (timeStr: string): number => {
      const [time, ms] = timeStr.split(',');
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds + parseInt(ms) / 1000;
    };

    const start = parseTime(startStr);
    const end = parseTime(endStr);
    const text = lines.slice(2).join(' ').trim();

    segments.push({
      start,
      duration: end - start,
      text,
    });
  }

  return segments;
}

export async function getYouTubeVideoData(url: string) {
  const videoId = await extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Demo mode: if no YouTube API key is set, return sample data so the
  // import -> library flow is fully visible in the browser without keys.
  if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'your-youtube-api-key-here') {
    return {
      videoId,
      title: 'How AI Agents Will Change Everything (Demo)',
      description:
        'A demo video imported without a YouTube API key. Add YOUTUBE_API_KEY to .env.local to fetch real metadata, transcripts, and chapters.',
      author: 'Second Brain AI Demo',
      duration_seconds: 732,
      published_at: new Date().toISOString(),
      thumbnail_url: '',
      chapters: [
        { start_time: 0, title: 'Introduction' },
        { start_time: 120, title: 'What are AI Agents?' },
        { start_time: 420, title: 'Building with the Second Brain' },
      ],
      segments: [
        { start: 0, duration: 10, text: 'Welcome to this demo of Second Brain AI.' },
        { start: 10, duration: 12, text: 'Today we explore how AI agents change knowledge work.' },
      ],
      transcript: 'Welcome to this demo of Second Brain AI. Today we explore how AI agents change knowledge work.',
    };
  }

  const video = await fetchVideoMetadata(videoId);
  if (!video) {
    throw new Error('Video not found');
  }

  const snippet = video.snippet!;
  const contentDetails = video.contentDetails!;

  // Parse duration (ISO 8601 format: PT1H30M15S)
  const durationMatch = contentDetails.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(durationMatch?.[1] || '0');
  const minutes = parseInt(durationMatch?.[2] || '0');
  const seconds = parseInt(durationMatch?.[3] || '0');
  const duration_seconds = hours * 3600 + minutes * 60 + seconds;

  // Fetch transcript
  let transcript: string | null = null;
  let segments: Array<{ start: number; duration: number; text: string }> = [];

  try {
    const srt = await fetchVideoTranscript(videoId);
    if (srt) {
      transcript = srt;
      segments = await parseTranscriptSrt(srt);
    }
  } catch (e) {
    console.warn('Transcript not available:', e);
  }

  // Fetch chapters
  const chapters = await fetchVideoChapters(videoId);

  return {
    videoId,
    title: snippet.title || 'Untitled',
    description: snippet.description || '',
    author: snippet.channelTitle || 'Unknown',
    duration_seconds,
    published_at: snippet.publishedAt || new Date().toISOString(),
    thumbnail_url: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || '',
    chapters,
    segments,
    transcript,
  };
}