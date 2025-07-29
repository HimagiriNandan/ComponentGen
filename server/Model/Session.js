import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  generatedComponents: { type: [String], default: [] },
  description: { type: String },
  tags: { type: [String], default: [] },
  componentsCount: { type: Number, default: 0 },
  chatMessages: { 
    type: [{
      id: { type: String, required: true },
      isUser: { type: Boolean, required: true },
      text: { type: String, required: true },
      time: { type: Date, default: Date.now },
      prompt: { type: String }, // Store the original prompt for each message
      generatedJsx: { type: String }, // Store JSX for each generation
      generatedCss: { type: String }, // Store CSS for each generation
      responseText: { type: String } // Store AI response text
    }], 
    default: [] 
  },
  currentJsx: { type: String, default: '' },
  currentCss: { type: String, default: '' },
  lastPrompt: { type: String }, // Store the most recent prompt
  lastGeneratedJsx: { type: String }, // Store the most recent JSX
  lastGeneratedCss: { type: String }, // Store the most recent CSS
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema); 