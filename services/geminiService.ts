import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// NOTE: This assumes process.env.API_KEY is available.
// In the production environment, the key is securely injected.

export const generateAIResponse = async (
  prompt: string,
  language: Language,
  tradition: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `
      You are a helpful, respectful, and conservative Orthodox Christian assistant.
      The user follows the ${tradition} tradition and speaks ${language}.
      
      RULES:
      1. Answer primarily in the ${language} language.
      2. If asked about dogmatic issues, strictly follow Eastern Orthodox theology.
      3. If the user asks for pastoral advice (e.g., "Can I divorce?", "What penance should I do?", "Can I take communion?"), 
         you MUST explicitly state that you are an AI and they must consult their local priest/spiritual father.
      4. Be concise, warm, and humble in tone.
      5. Do not criticize other religions.
      6. If you don't know the answer, admit it.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "I apologize, I could not generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while contacting the assistant. Please try again later.";
  }
};

export const generatePersonalizedPrayer = async (
  language: Language,
  tradition: string,
  topic: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `
      You are a prayer writer in the Eastern Orthodox Christian tradition.
      The user speaks ${language} and follows the ${tradition} tradition.
      
      Task: Write a short, heartfelt, and dogmatically correct Orthodox prayer based on the user's topic.
      The prayer should be addressed to the Holy Trinity, Christ, the Theotokos, or a Saint.
      Use traditional language and style (reverent, humble).
      Return ONLY the text of the prayer.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Topic: ${topic}`,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error (Prayer):", error);
    return "";
  }
};