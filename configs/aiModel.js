// import { GoogleGenAI } from "@google/genai";

// async function main() {
//   const ai = new GoogleGenAI({
//     apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
//   });

//   const response = await ai.models.generateContentStream({
//     model: "gemini-3.1-flash-lite",
//     config: {
//       thinkingConfig: {
//         thinkingLevel: "MINIMAL",
//       },
//       tools: [{ googleSearch: {} }],
//     },
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: "Explain how AI agents work." }],
//       },
//     ],
//  });

//   for await (const chunk of response) {
//     if (chunk.text) {
//       process.stdout.write(chunk.text);
//     }
//   }
// }

// main().catch(console.error);


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
