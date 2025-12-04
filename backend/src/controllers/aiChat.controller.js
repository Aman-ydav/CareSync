import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ChatMessage } from "../models/ChatMessage.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: process.env.GENAI_MODEL || "gemini-pro" 
});

const chatWithAI = asyncHandler(async (req, res) => {
  const { message, sessionId = 'default' } = req.body;
  const userId = req.user?._id;

  if (!message || message.trim() === '') {
    throw new ApiError(400, 'Message is required');
  }

  // Medical disclaimer
  const disclaimer = "**Disclaimer:** I am an AI assistant and cannot provide medical diagnoses. My responses are for informational purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.\n\n";

  // Create medical context
  const prompt = `You are a helpful medical assistant named CareSync AI. You provide general health information, wellness tips, and explain medical concepts in simple terms.

IMPORTANT RULES:
1. NEVER provide medical diagnoses
2. NEVER prescribe medications
3. ALWAYS advise users to consult healthcare professionals
4. Provide accurate, evidence-based information
5. Be empathetic and supportive
6. If unsure, say "I recommend consulting a healthcare professional"

User's message: "${message}"

Provide a helpful, informative response:`;

  try {
    const result = await model.generateContent(prompt);
    let aiResponse = disclaimer;
    
    // Handle different response formats from Gemini
    if (result && result.response) {
      const text = result.response.text();
      aiResponse += text;
    } else if (result && result.candidates && result.candidates[0]) {
      aiResponse += result.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from AI');
    }

    // Save chat message if user is authenticated
    if (userId) {
      await ChatMessage.create({
        user: userId,
        message: message.trim(),
        response: aiResponse,
        sessionId,
        metadata: {
          timestamp: new Date(),
          model: process.env.GENAI_MODEL || "gemini-pro"
        }
      });
    }

    return res.status(200).json(
      new ApiResponse(200, { response: aiResponse }, "AI response generated successfully")
    );
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Fallback response
    const fallbackResponse = "**Disclaimer:** This is not medical advice. Consult your doctor for professional guidance.\n\nI apologize, but I'm currently experiencing technical difficulties. Please try again later or contact your healthcare provider directly for assistance.";

    return res.status(200).json(
      new ApiResponse(200, { response: fallbackResponse }, "Generated fallback response")
    );
  }
});

const getChatHistory = asyncHandler(async (req, res) => {
  const { sessionId = 'default', limit = 50 } = req.query;
  const userId = req.user._id;

  const messages = await ChatMessage.find({
    user: userId,
    sessionId
  })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .select('message response createdAt');

  return res.status(200).json(
    new ApiResponse(200, { messages }, "Chat history fetched successfully")
  );
});

const clearChatHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const userId = req.user._id;

  const filter = { user: userId };
  if (sessionId) filter.sessionId = sessionId;

  await ChatMessage.deleteMany(filter);

  return res.status(200).json(
    new ApiResponse(200, null, "Chat history cleared successfully")
  );
});

export {
  chatWithAI,
  getChatHistory,
  clearChatHistory
};