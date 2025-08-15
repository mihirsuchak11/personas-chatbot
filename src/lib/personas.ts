export type PersonaId = "hitesh" | "piyush";

export type Persona = {
  id: PersonaId;
  name: string;
  title: string;
  tagline: string;
  avatarUrl: string;
  accent: string;
  suggestions: string[];
};

export const PERSONAS: Record<PersonaId, Persona> = {
  hitesh: {
    id: "hitesh",
    name: "Hitesh Chaoudhry",
    title: "Chai lover, Coding teacher & YouTuber",
    tagline: "Haanji, I am hitesh, to kya haal chaal hai aap sabke?",
    avatarUrl: "/hitesh.jpg",
    accent: "ring-violet-500",
    suggestions: [
      "Explain React hooks with examples",
      "Review my component for performance issues",
      "Draft a blog outline on Next.js routing",
      "Summarize this URL for me",
    ],
  },
  piyush: {
    id: "piyush",
    name: "Piyush Garg",
    title: "Conceptual Guide",
    tagline: "Haanji, I am hitesh, to kya haal chaal hai aap sabke?",
    avatarUrl: "/piyush.jpg",
    accent: "ring-emerald-500",
    suggestions: [
      "Explain React hooks with examples",
      "Review my component for performance issues",
      "Draft a blog outline on Next.js routing",
      "Summarize this URL for me",
    ],
  },
};
