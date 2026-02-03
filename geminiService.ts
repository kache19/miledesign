
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

export const getAIConstructionAdvice = async (prompt: string, history: {role: string, content: string}[]) => {
  if (!apiKey) {
    return "API key is missing. Please ensure it is configured.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are 'MILEDESIGNS AI', a world-class senior consultant for MILEDESIGNS Design & Build.
    You specialize in residential and commercial construction, architectural design, material selection, and sustainable building practices.
    Keep your answers professional, technical but accessible, and always prioritize safety and local building codes.
    If asked about costs, provide general ranges but emphasize that an official quote requires a site visit.
    Mention that MILEDESIGNS Design & Build offers these services.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1000,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to our AI Architect. Please try again later.";
  }
};