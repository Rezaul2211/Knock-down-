import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const key = process.env.GEMINI_API_KEY;
      
      if (!key) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
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
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to communicate with AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
