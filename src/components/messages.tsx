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

  // Auto scroll to bottom when messages change
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
              className={`flex gap-3 ${
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
                    console.log(part, "part");
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            className="whitespace-pre-wrap font-jetbrains"
                            key={`${m.id}-${index}`}
                          >
                            {/* {part.text} */}
                            <LinkifiedText text={part.text} />
                          </div>
                        );
                    }
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

function LinkifiedText({ text }: { text: string }) {
  // Split by lines so we can detect platform hints per line
  const lines = text.split(/\r?\n/);

  return (
    <>
      {lines.map((line, li) => (
        <div key={li}>
          {linkifyLine(line)}
          {li < lines.length - 1 ? <br /> : null}
        </div>
      ))}
    </>
  );
}

function linkifyLine(line: string) {
  // Basic patterns
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<]+/gi;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi;

  // Platform hints (per line)
  const hasYouTube =
    /(?:\bYou\s?Tube\b|\bYoutube\b|\bYT\b|\byoutube\.com\b)/i.test(line);
  const hasTwitter = /(?:\bTwitter\b|\bX\b|\bx\.com\b)/i.test(line);
  const hasInstagram = /(?:\bInstagram\b|\bIG\b|\binsta\b)/i.test(line);
  const hasGitHub = /(?:\bGitHub\b|\bgithub\.com\b)/i.test(line);

  // Standalone @handles (avoid emails already matched)
  // Note: keep handles simple (letters, numbers, underscore, dot, hyphen)
  const handleRegex = /(^|[\s([{-])@([A-Za-z0-9._-]{2,30})\b/g;

  // We’ll replace in a single pass: URLs/emails first, then platform handles
  const tokens: Array<string | React.ReactNode> = [];
  let lastIndex = 0;

  // Helper to push plain text chunks safely
  const pushPlain = (end: number) => {
    if (end > lastIndex) tokens.push(line.slice(lastIndex, end));
    lastIndex = end;
  };

  // 1) Linkify URLs
  for (const match of line.matchAll(urlRegex)) {
    const start = match.index ?? 0;
    const raw = match[0];
    pushPlain(start);

    const href = raw.startsWith("http") ? raw : `https://${raw}`;
    tokens.push(
      <a
        key={`u-${start}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="underline text-blue-400 hover:text-blue-300 break-words"
      >
        {raw}
      </a>
    );
    lastIndex = start + raw.length;
  }

  // 2) Linkify emails
  const afterUrls = line.slice(lastIndex);
  if (afterUrls) {
    // Process emails in the remaining slice
    const emailTokens: Array<string | React.ReactNode> = [];
    let eLast = 0;
    for (const m of afterUrls.matchAll(emailRegex)) {
      const eStart = m.index ?? 0;
      const raw = m[0];
      if (eStart > eLast) emailTokens.push(afterUrls.slice(eLast, eStart));
      emailTokens.push(
        <a
          key={`e-${lastIndex + eStart}`}
          href={`mailto:${raw}`}
          className="underline text-blue-400 hover:text-blue-300 break-words"
        >
          {raw}
        </a>
      );
      eLast = eStart + raw.length;
    }
    if (eLast < afterUrls.length) emailTokens.push(afterUrls.slice(eLast));
    // Replace tokens with email-processed ones
    tokens.push(...emailTokens);
    lastIndex = line.length;
  }

  // At this point, tokens include links for URLs/emails and plain strings.
  // 3) Now go through tokens and within plain strings, convert @handles with platform hints.
  const finalTokens: Array<string | React.ReactNode> = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (typeof t !== "string") {
      finalTokens.push(t);
      continue;
    }

    const str = t;
    let cursor = 0;
    for (const m of str.matchAll(handleRegex)) {
      const start = m.index ?? 0;
      const prefix = m[1] ?? ""; // leading char or space
      const handle = m[2];

      // Avoid turning emails into handles (already handled) and extremely short/long handles
      // Decide destination by platform hints present in THIS line:
      let href: string | null = null;
      if (hasYouTube) href = `https://www.youtube.com/@${handle}`;
      else if (hasTwitter) href = `https://x.com/${handle}`;
      else if (hasInstagram) href = `https://instagram.com/${handle}`;
      else if (hasGitHub) href = `https://github.com/${handle}`;
      // If no hint, leave as plain text to avoid wrong links.
      if (!href) continue;

      if (start > cursor) finalTokens.push(str.slice(cursor, start));
      // Keep the delimiter/prefix (space, punctuation) before @
      finalTokens.push(prefix);
      finalTokens.push(
        <a
          key={`h-${i}-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="underline text-blue-400 hover:text-blue-300"
        >
          @{handle}
        </a>
      );
      cursor = start + prefix.length + 1 + handle.length; // prefix + '@' + handle
    }
    if (cursor < str.length) finalTokens.push(str.slice(cursor));
  }

  return finalTokens.length ? finalTokens : tokens.length ? tokens : line;
}
