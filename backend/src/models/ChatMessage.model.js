import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  response: {
    type: String,
    required: true
  },

  sessionId: {
    type: String,
    default: "default"
  },

  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    }
  }

}, {
  timestamps: true
});

chatMessageSchema.index({ user: 1, createdAt: -1 });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
