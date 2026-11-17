import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatSession = ai.chats.create({
  model: "gemini-3.5-flash-lite",

  config: {
    temperature: 1,
    topP: 0.95,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    tools: [{ googleSearch: {} }],
  },

  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate a 30-second video.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: JSON.stringify([
            {
              imagePrompt: "A bustling futuristic city...",
            },
          ]),
        },
      ],
    },
  ],
});
