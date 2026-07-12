/**
 * Shared AI helper — all LLM calls in AI Brain go through OpenRouter.
 *
 * We use the installed `openai` SDK but point it at OpenRouter's OpenAI-compatible
 * endpoint, authenticating with OPENROUTER_API_KEY (set in .env.local).
 *
 * ── Model selection ──────────────────────────────────────────────────────────
 *   The model is read from OPENROUTER_MODEL (set in .env.local). If it's missing,
 *   a safe default is used. To use a SPECIFIC model, set, e.g.:
 *     OPENROUTER_MODEL=anthropic/claude-3.7-sonnet
 *   (any model ID available on your OpenRouter account works).
 */

import OpenAI from 'openai';

/** Safe default so the app runs even before OPENROUTER_MODEL is set. */
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
}

let client: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Add it to .env.local to enable AI features.'
    );
  }
  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        // OpenRouter asks for a referer/site URL for analytics; harmless.
        'HTTP-Referer': 'https://ai-brain.local',
        'X-Title': 'AI Brain',
      },
    });
  }
  return client;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  /** Force JSON output and parse it. */
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
}

/**
 * One-shot chat completion. Returns the assistant message text.
 * If `json` is true, the result is parsed and returned as a JS object.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  opts: CompletionOptions = {}
): Promise<string> {
  const model = getOpenRouterModel();
  console.log(`[ai] chatCompletion model=${model} messages=${messages.length} json=${!!opts.json}`);

  const response = await getClient().chat.completions.create({
    model,
    messages,
    temperature: opts.temperature ?? 0.4,
    max_tokens: opts.maxTokens,
    response_format: opts.json ? { type: 'json_object' } : undefined,
  });

  const content = response.choices?.[0]?.message?.content ?? '';
  return content;
}

/**
 * Streaming chat completion. Yields text deltas as they arrive.
 * Used by the Chat and AI Brain interfaces for a live, typewriter feel.
 */
export async function* streamChatCompletion(
  messages: ChatMessage[],
  opts: CompletionOptions = {}
): AsyncGenerator<string> {
  const model = getOpenRouterModel();
  console.log(`[ai] streamChatCompletion model=${model} messages=${messages.length}`);

  const stream = await getClient().chat.completions.create({
    model,
    messages,
    temperature: opts.temperature ?? 0.4,
    max_tokens: opts.maxTokens,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) yield delta;
  }
}

/** Parse a JSON string that may be wrapped in a ```json fenced block. */
export function parseJson<T = unknown>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonText) as T;
}
