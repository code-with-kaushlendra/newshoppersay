import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, the API key is obtained exclusively from the environment
// variable `process.env.API_KEY` and is assumed to be pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (title: string): Promise<string> => {
  try {
    const prompt = `Generate a compelling and brief e-commerce product description for the following product: "${title}". Highlight key features and benefits for a potential buyer. Keep it under 50 words. Do not use hashtags.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    // Use the .text property for direct text output.
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    // Provide a user-friendly error message.
    return "Could not generate an AI description at this time. Please try again later.";
  }
};
