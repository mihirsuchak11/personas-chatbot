"use client";

import Messages from "@/components/messages";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import React, { useState } from "react";
import PersonaSwitcher from "@/components/persona-switcher";
import { DefaultChatTransport } from "ai";
import { PersonaId, PERSONAS } from "@/lib/personas";
import Image from "next/image";
import ChatInput from "./chat-input";

export default function ChatClient({ personaId }: { personaId: PersonaId }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop, resumeStream } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { personaId },
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.10),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.08),transparent_60%)]" />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-zinc-800">
          <PersonaSwitcher personaId={personaId} resumeStream={resumeStream} />
        </header>
        {error && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-red-500 text-center mb-4">
              {error?.message || "Something went wrong!"}
            </div>
          </div>
        )}
        {messages.length === 0 ? (
          <EmptyState
            personaId={personaId}
            onSend={(text) => sendMessage({ text })}
          />
        ) : (
          <Messages
            messages={messages}
            showLoader={status === "submitted"}
            personaId={personaId}
          />
        )}

        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              handleKeyDown={handleKeyDown}
              handleSubmit={handleSubmit}
              input={input}
              setInput={setInput}
              status={status}
              stop={stop}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  personaId,
  onSend,
}: {
  personaId: keyof typeof PERSONAS;
  onSend: (text: string) => void;
}) {
  const persona = PERSONAS[personaId];

  return (
    <div className="relative font-inter flex-1">
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <Image
          src={persona.avatarUrl}
          alt={persona.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full border border-gray-700 shadow mb-4"
        />
        <h2 className="text-3xl font-semibold text-white">
          Hi, I’m {persona.name}
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-w-md">{persona.tagline}</p>

        <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-2xl">
          {persona.suggestions.map((s) => (
            <Button key={s} onClick={() => onSend(s)} variant="secondary">
              {s}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
