import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  response: {
    type: String,
    required: true,
    trim: true
  },
  sessionId: {
    type: String,
    default: 'default',
    index: true
  },
  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    model: {
      type: String,
      default: 'gemini-pro'
    }
  }
}, {
  timestamps: true
});

chatMessageSchema.index({ user: 1, createdAt: -1 });
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);