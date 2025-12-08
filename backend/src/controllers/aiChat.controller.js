import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import "../config.js";

// 1. TRIM THE VALUES TO REMOVE HIDDEN SPACES
const API_KEY = (process.env.GENAI_API_KEY || "").trim();
// 2. USE THE SPECIFIC '-001' VERSION FOR STABILITY
const MODEL_NAME = (process.env.GENAI_MODEL || "gemini-1.5-flash-001").trim();

if (!API_KEY) {
  console.error("❌ GENAI_API_KEY is missing in .env");
}

const SYSTEM = `
You are CareSync AI. Provide helpful, general health education and wellness guidance.
Rules:
- NO diagnosis.
- NO prescribing medicine.
- NO treatment plans.
- Encourage consulting real doctors.
- Be friendly, helpful, supportive.
- If serious issue => tell to seek medical help.
`;

export const chatWithAI = asyncHandler(async (req, res) => {
  const { message, sessionId = "default" } = req.body;
  const userId = req.user._id;

  if (!message?.trim()) {
    throw new ApiError(400, "Message is required");
  }

  const prompt = `
${SYSTEM}
User: ${message}
Respond safely & ethically with educational information.
  `.trim();

  try {
    // 3. LOG THE URL FOR DEBUGGING (Remove in production)
    // This helps you see if the URL looks like: .../models/gemini-1.5-flash-001:generateContent...
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    // console.log("Requesting AI URL:", url); // Uncomment to debug if it fails again

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("AI HTTP error:", response.status, response.statusText, errorText);
      
      // Better error message for debugging
      throw new Error(`Gemini HTTP error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    let aiText = "";
    if (data.candidates?.length) {
      const parts = data.candidates[0].content?.parts || [];
      aiText = parts.map((p) => p.text || "").join(" ").trim();
    }

    if (!aiText) {
      aiText = "I'm sorry, I couldn't generate a response this time.";
    }

    const disclaimer = "**Disclaimer:** I'm an AI assistant. This is not medical advice. Always consult a real doctor.\n\n";
    const finalResponse = disclaimer + aiText;

    await ChatMessage.create({
      user: userId,
      sessionId,
      message: message.trim(),
      response: finalResponse,
    });

    return res.json(
      new ApiResponse(200, { response: finalResponse }, "OK")
    );
  } catch (error) {
    console.error("AI ERROR:", error);

    const fallback = "**Disclaimer:** This is not medical advice.\n\nI'm having trouble responding now. Please try again later.";
    
    // Return 200 even on error so frontend doesn't crash, just shows fallback
    return res.json(
      new ApiResponse(200, { response: fallback }, "Fallback")
    );
  }
});

// ... keep getChatHistory and clearChatHistory as they were
export const getChatHistory = asyncHandler(async (req, res) => {
  const { sessionId = "default", limit = 50 } = req.query;
  const userId = req.user._id;
  const messages = await ChatMessage.find({ user: userId, sessionId })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .select("message response createdAt");
  return res.json(new ApiResponse(200, { messages }, "History Loaded"));
});

export const clearChatHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const userId = req.user._id;
  const filter = { user: userId };
  if (sessionId) filter.sessionId = sessionId;
  await ChatMessage.deleteMany(filter);
  return res.json(new ApiResponse(200, null, "Cleared"));
});