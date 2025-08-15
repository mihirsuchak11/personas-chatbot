import { UIMessage, streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { PersonaId } from "@/lib/personas";
import { HITESH_CONTEXT, HITESH_PROMPT_RULES } from "@/lib/prompts/hitesh";
import { PIYUSH_CONTEXT, PIYUSH_PROMPT_RULES } from "@/lib/prompts/piyush";

export async function POST(req: Request) {
  try {
    const {
      messages,
      personaId,
    }: { messages: UIMessage[]; personaId: PersonaId } = await req.json();

    const system =
      personaId === "hitesh" ? HITESH_PROMPT_RULES : PIYUSH_PROMPT_RULES; //TODO: Replace here for another person

    const context = `CONTEXT_JSON:\n${
      personaId === "hitesh" ? HITESH_CONTEXT : PIYUSH_CONTEXT //TODO: Replace here for another person
    }`;

    const result = await streamText({
      model: openai("gpt-4.1-nano"),
      messages: [
        { role: "system", content: system },
        { role: "system", content: context },

        ...convertToModelMessages(messages),
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating text:", error);
    return Response.json({ error: "Failed to stream chat" }, { status: 500 });
  }
}
