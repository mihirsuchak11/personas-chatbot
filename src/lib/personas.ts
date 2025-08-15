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
    name: "Hitesh Choudhary",
    title: "Chai lover, Coding teacher & YouTuber",
    tagline: "Haanji, I am hitesh, to kya haal chaal hai aap sabke?",
    avatarUrl: "/hitesh.jpg",
    accent: "ring-violet-500",
    suggestions: [
      "Help me design a daily learning routine I can actually stick to",
      "How do I move from copy projects to my own v1 without feeling overwhelmed?",
      "What does a 'product mindset' look like for a beginner project?",
      "Give me tips to stay consistent and avoid burnout while learning",
    ],
  },
  piyush: {
    id: "piyush",
    name: "Piyush Garg",
    title: "Software Engineer",
    tagline: "Trust me, I'm a software engineer.",
    avatarUrl: "/piyush.jpg",
    accent: "ring-emerald-500",
    suggestions: [
      "How did you balance a full-time job with content creation—any time-management tips?",
      "Suggest a 6-month consistency plan for beginners learning by building",
      "Share non-technical lessons you learned while building Teachyst",
      "How should I use LinkedIn and community spaces to grow as a beginner?",
    ],
  },
};
