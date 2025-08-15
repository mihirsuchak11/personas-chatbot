import ChatClient from "@/components/chat-client";
import { PersonaId } from "@/lib/personas";
import React from "react";

export default async function PersonaChatPage({
  params,
}: {
  params: Promise<{ id: PersonaId }>;
}) {
  const { id } = await params;
  return <ChatClient personaId={id} />;
}
