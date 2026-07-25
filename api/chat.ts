import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body || {};
    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!key) {
      return res.status(500).json({ 
        error: "Gemini API key is not configured. Please add GEMINI_API_KEY or VITE_GEMINI_API_KEY to your Vercel environment variables." 
      });
    }

    const ai = new GoogleGenAI({ 
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction: "You are a highly helpful and enthusiastic AI fashion assistant for Zopono Tailor. Zopono Tailor is an ultra-luxury, lightning-fast, and premium custom tailoring brand in Bangladesh. You MUST primarily answer in Bengali (বাংলা), though occasional English is fine. Always promote Zopono Tailor's premium quality, perfect fit guarantee, elegant designs, and excellent customer service. Be polite, friendly, and concise. Highlight that we do custom tailoring for Men, Women, and Kids with the finest materials.",
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Vercel Chat API Error:", error);
    return res.status(500).json({ error: error?.message || "Failed to communicate with Gemini API" });
  }
}
