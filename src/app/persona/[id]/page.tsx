import ChatClient from "@/components/chat-client";
import { PersonaId } from "@/lib/personas";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: PersonaId }> }) => {
  const { id } = await params;

  return <ChatClient personaId={id} />;
};

export default Page;
