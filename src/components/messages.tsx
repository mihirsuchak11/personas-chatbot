import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UIMessage } from "ai";
import { PersonaId, PERSONAS } from "@/lib/personas";

export default function Messages({
  messages,
  showLoader,
  personaId,
}: {
  messages: UIMessage[];
  showLoader: boolean;
  personaId: PersonaId;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentPersona = PERSONAS[personaId];

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 max-w-4xl mx-auto w-full">
      <div className="space-y-6">
        {messages.map((m) => {
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={`flex gap-3 items-end ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Assistant avatar on the left */}
              {!isUser && (
                <Avatar className="w-8 h-8 mt-1 shrink-0">
                  <AvatarImage
                    src={currentPersona?.avatarUrl}
                    alt="Assistant"
                  />
                </Avatar>
              )}

              {/* Message bubble */}
              <div className="max-w-[75%]">
                <div
                  className={`rounded-2xl px-4 py-2 whitespace-pre-wrap leading-relaxed ${
                    isUser
                      ? "bg-[#26272D] text-white rounded-br-sm"
                      : "bg-[#3f395c] text-white rounded-bl-sm"
                  }`}
                >
                  {m.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <div
                          className="whitespace-pre-wrap font-jetbrains"
                          key={`${m.id}-${index}`}
                        >
                          {/* {part.text} */}
                          <LinkifyUrls text={part.text} />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* User avatar on the right */}
              {isUser && (
                <Avatar className="w-8 h-8 mt-1 shrink-0">
                  <AvatarFallback className="bg-[#505163] text-white font-semibold text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
      {/* Typing loader row (assistant on left) */}
      {showLoader && (
        <AssistantTypingRow avatarUrl={currentPersona?.avatarUrl} />
      )}
      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}

function AssistantTypingRow({ avatarUrl }: { avatarUrl: string }) {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="w-8 h-8 mt-1 shrink-0">
        <AvatarImage src={avatarUrl} alt="Assistant" />
      </Avatar>
      <div className="max-w-[75%]">
        <div className="rounded-2xl px-4 py-2 bg-zinc-800 text-zinc-100 rounded-bl-sm">
          <TypingDots />
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 text-zinc-400">
      <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.30s]" />
      <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
    </div>
  );
}

function LinkifyUrls({ text }: { text: string }) {
  const URL_RE = /(https?:\/\/[^\s<>"')\]}]+)/gi;

  // Render each line to preserve original line breaks
  return (
    <>
      {text.split(/\r?\n/).map((line, li) => {
        const nodes: React.ReactNode[] = [];
        let last = 0;

        for (const m of line.matchAll(URL_RE)) {
          const start = m.index ?? 0;
          const raw = m[0];

          // push preceding text
          if (start > last) nodes.push(line.slice(last, start));

          // trim trailing punctuation like ".", ",", ")", "]", "}"
          const trimmed = raw.replace(/[.,)\]\}]+$/g, "");
          const trailing = raw.slice(trimmed.length);

          nodes.push(
            <a
              key={`u-${li}-${start}`}
              href={trimmed}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline text-white hover:text-blue-300 break-words"
            >
              {trimmed}
            </a>
          );

          // re-add any trimmed punctuation as plain text
          if (trailing) nodes.push(trailing);
          last = start + raw.length;
        }

        if (last < line.length) nodes.push(line.slice(last));

        return (
          <div key={li} className="whitespace-pre-wrap break-words">
            {nodes.length ? nodes : line}
          </div>
        );
      })}
    </>
  );
}
