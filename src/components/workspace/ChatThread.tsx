import type { ChatMessage } from './types';
import { Dots } from './icons';

export default function ChatThread({ messages }: { messages: ChatMessage[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 py-6">
      {messages.map((m, i) => (
        <div
          key={i}
          className={
            'ws-animate-rise flex ' +
            (m.role === 'user' ? 'justify-end' : 'justify-start')
          }
        >
          {m.role === 'user' ? (
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-[0_10px_30px_-12px_rgba(37,99,235,0.7)]">
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ) : (
            <div className="max-w-[90%]">
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Assistant
              </div>
              <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] leading-relaxed text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                {m.content === '' ? (
                  <Dots />
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
