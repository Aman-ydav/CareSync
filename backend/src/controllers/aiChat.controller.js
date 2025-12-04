// import statements
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatMessage from '../models/ChatMessage.js';

// Initialize AI model
const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: process.env.GENAI_MODEL || "gemini-pro" 
});

// Medical disclaimer constant
const MEDICAL_DISCLAIMER = "Disclaimer: This is not medical advice. Consult your doctor for professional guidance.\n\n";

// Fallback response
const FALLBACK_RESPONSE = `${MEDICAL_DISCLAIMER}I apologize, but I'm currently experiencing technical difficulties. Please try again later or contact your healthcare provider directly for assistance.`;

// Prompt template
const createMedicalPrompt = (userMessage) => {
  return `You are a helpful medical assistant. The user asked: "${userMessage}"
    
Please provide helpful information but always remember to:
1. Not give medical diagnoses
2. Encourage consulting healthcare professionals
3. Provide general health information only
4. Be empathetic and supportive

Response:`;
};

// Main chat function
export const chatWithAI = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?._id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const prompt = createMedicalPrompt(message);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiResponse = response.text();

    // Ensure disclaimer is included
    if (!aiResponse.includes('Disclaimer')) {
      aiResponse = MEDICAL_DISCLAIMER + aiResponse;
    }

    // Save chat message if user is authenticated
    if (userId) {
      await ChatMessage.create({
        user: userId,
        message,
        response: aiResponse,
        sessionId: sessionId || 'default'
      });
    }

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    res.json({ response: FALLBACK_RESPONSE });
  }
};

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    const messages = await ChatMessage.find({
      user: req.user._id,
      sessionId
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};