import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client lazily/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "KamerStyle API", timestamp: new Date().toISOString() });
  });

  // AI Support Chatbot Endpoint
  app.post("/api/chat/support", async (req, res) => {
    try {
      const { message, history, productContext } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGenAI();

      // System instruction detailing full KamerStyle platform knowledge
      const systemInstruction = `You are "KamerStyle AI Support Concierge", the official intelligent AI assistant for Cameroon's premier fashion & dressing marketplace (KamerStyle).
You help buyers and sellers with all questions regarding the website, dressings, transactions, and Cameroon fashion culture.

Platform Key Information:
- Platform Name: KamerStyle (Cameroon Dressing Marketplace)
- Platform Administrator & Executive Concierge: Simon Tangu (Contact: +237650135276 / simontangu317@gmail.com)
- Accepted Currencies: FCFA (Central African CFA Franc, XAF), USD, EUR, GBP. Primary pricing is in FCFA.
- Payment Methods: MTN Mobile Money (MoMo), Orange Money, Direct Bank/Visa Transfer with 100% Escrow buyer & seller protection.
- Delivery Network: Nationwide 24h/48h inter-city courier across Cameroon (Douala, Yaoundé, Bamenda, Bafoussam, Limbe, Buea, Maroua, Garoua, Ngaoundéré, Kribi, Ebolowa) via trusted travel agencies & private couriers. Diaspora international shipping available via DHL/FedEx.
- Authentic Cameroonian Dressings Available:
  1. Bamenda Toghu: Royal black velvet regalia intricately hand-embroidered with gold, yellow, and red silk threads from the North West Grassfields.
  2. Sawa Kaba Ngondo: Elegant flowing satin silk robes from the coastal Douala / Limbe Sawa people.
  3. Bamileke / Bamum Ndop: Sacred resist-dyed indigo royal textile with ancestral geometric motifs from the West Region.
  4. Modern Ankara Couture: High-fashion dresses, corsets, and jumpsuits with premium 100% cotton African wax prints.
  5. African Luxury Bridal Attire: Beaded Toghu wedding gowns, French lace bridal wear with cathedral trains.
  6. Bespoke Men's Fashion: Northern Cameroon Grand Boubou (Getzner Bazin Riche), Dashiki tailored suits.
  7. Accessories & Shoes: Handcrafted Maroua leather loafers, Bamileke beaded headdresses, Cowrie shell corsets, Toghu mules.

Features of KamerStyle:
- Buying: Browse shop, filter by category/region/price, wishlist favorite dressings, calculate prices in multiple currencies, chat directly with designers in-app or transfer to WhatsApp.
- Selling: Any fashion designer or individual in Cameroon can list dressings for free with their own name, photos, pricing, sizing, and contact info.
- In-App Chat: Buyers and sellers can converse directly in real-time before finalizing sales.
- Admin Supervision: Admin Simon Tangu oversees dispute resolution, authentic item verification, and seller support.

Tone & Style:
- Professional, culturally authentic, warm, and helpful.
- Provide concise, practical answers. If asked about prices, give estimated ranges in FCFA.
- If asked about purchasing, suggest using the in-app chat with the designer or clicking WhatsApp to order directly.
- Support both English and French if the user asks in French.`;

      if (!ai) {
        // Fallback simulated intelligent response if GEMINI_API_KEY is not configured yet
        const fallbackReplies: Record<string, string> = {
          default: "Hello and welcome to KamerStyle! I am your AI Support Concierge. You can browse authentic Cameroonian dressings like Bamenda Toghu, Sawa Kaba Ngondo, Bamileke Ndop, and modern Ankara, or chat directly with our verified designers. How can I assist you with your dressing inquiry or order today?",
          toghu: "Bamenda Toghu is Cameroon's royal regalia from the North West region, hand-embroidered with heavy gold threads on rich velvet. On KamerStyle, authentic Toghu outfits range from 32,000 FCFA for accessories/slippers up to 185,000 FCFA for full 3-piece royal suits. Custom tailoring measurements can be provided directly to the seller via our in-app chat!",
          delivery: "We provide nationwide delivery across all 10 regions of Cameroon (Douala, Yaoundé, Bamenda, Bafoussam, Limbe, Maroua) within 24–48 hours via inter-city courier. For international buyers in the diaspora, DHL/FedEx worldwide shipping is coordinated with escrow protection.",
          sell: "Selling on KamerStyle is completely free! Simply click '+ Sell Item' in the menu, upload photos of your traditional dressing, modern gown, shoes, or accessories, set your asking price in FCFA, and provide your WhatsApp contact info. Your listing will go live instantly across Cameroon.",
          payment: "Transactions on KamerStyle are supported via MTN Mobile Money (MoMo), Orange Money, and Visa cards under our Escrow Buyer Protection. Funds are securely held until you inspect the authenticity and fit of your dressing upon delivery.",
        };

        const lower = message.toLowerCase();
        let selected = fallbackReplies.default;
        if (lower.includes("toghu") || lower.includes("bamenda")) selected = fallbackReplies.toghu;
        else if (lower.includes("deliver") || lower.includes("ship") || lower.includes("douala") || lower.includes("yaounde")) selected = fallbackReplies.delivery;
        else if (lower.includes("sell") || lower.includes("list") || lower.includes("vendor")) selected = fallbackReplies.sell;
        else if (lower.includes("pay") || lower.includes("momo") || lower.includes("orange") || lower.includes("escrow") || lower.includes("price")) selected = fallbackReplies.payment;

        return res.json({ reply: selected, simulated: true });
      }

      // Format conversation history for Gemini
      const contents: any[] = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          if (item.text && item.text.trim()) {
            contents.push({
              role: item.role === "model" ? "model" : "user",
              parts: [{ text: item.text }],
            });
          }
        }
      }

      let currentPrompt = message;
      if (productContext) {
        currentPrompt = `[User is currently viewing product: "${productContext.name}", Category: ${productContext.category}, Price: ${productContext.price} FCFA, Seller: ${productContext.seller?.name || "Verified Atelier"}]\n\nUser query: ${message}`;
      }

      contents.push({
        role: "user",
        parts: [{ text: currentPrompt }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I am here to help you explore KamerStyle's dressing collections, ordering process, and designer contacts. How can I assist you further?";

      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini AI chat error:", error);
      return res.status(500).json({
        error: "Failed to generate AI response",
        fallback: "Hello! I am the KamerStyle AI assistant. Feel free to explore our Cameroon dressing catalog, or connect with Admin Simon Tangu at +237650135276 for immediate concierge support.",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        if (vite && vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KamerStyle server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
