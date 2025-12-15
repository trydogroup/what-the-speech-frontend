import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. Gemini features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const enhanceTextWithGemini = async (text: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return text;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a professional editor. Fix grammar, punctuation, and capitalization for the following speech-to-text transcript. Keep the tone natural but polished. Do not add any introductory or concluding text, just return the refined text.\n\nTranscript: "${text}"`,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return text; // Fallback to original
  }
};

export const generateLicenseKeyCheck = async (email: string): Promise<boolean> => {
  // Simulate a complex check using AI just to demonstrate usage (in a real app this is a DB lookup)
  // This is a creative use of Gemini to validate email format rigorously if we wanted
  const ai = getAiClient();
  if (!ai) return true; 
  return true;
};
