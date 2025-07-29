import express from 'express';
import Session from '../Model/Session.js';

const router = express.Router();

// Helper function to ensure proper Date objects
const ensureDateObjects = (chatMessages) => {
  if (!Array.isArray(chatMessages)) return chatMessages;
  
  return chatMessages.map(message => ({
    ...message,
    time: message.time instanceof Date ? message.time : new Date(message.time)
  }));
};

// GET all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single session
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create session
router.post('/', async (req, res) => {
  try {
    const { 
      prompt, 
      generatedComponents, 
      description, 
      tags, 
      componentsCount, 
      chatMessages, 
      currentJsx, 
      currentCss,
      lastPrompt,
      lastGeneratedJsx,
      lastGeneratedCss
    } = req.body;
    
    // Ensure chat messages have proper Date objects
    const processedChatMessages = ensureDateObjects(chatMessages || []);
    
    const session = await Session.create({ 
      prompt, 
      generatedComponents: generatedComponents || [], 
      description, 
      tags: tags || [], 
      componentsCount: componentsCount || 0,
      chatMessages: processedChatMessages,
      currentJsx: currentJsx || '',
      currentCss: currentCss || '',
      lastPrompt: lastPrompt || prompt,
      lastGeneratedJsx: lastGeneratedJsx || currentJsx || '',
      lastGeneratedCss: lastGeneratedCss || currentCss || ''
    });
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update session with new chat messages and generated code
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      chatMessages, 
      currentJsx, 
      currentCss, 
      generatedComponents,
      lastPrompt,
      lastGeneratedJsx,
      lastGeneratedCss
    } = req.body;
    
    const updateData = {};
    if (chatMessages !== undefined) {
      updateData.chatMessages = ensureDateObjects(chatMessages);
    }
    if (currentJsx !== undefined) updateData.currentJsx = currentJsx;
    if (currentCss !== undefined) updateData.currentCss = currentCss;
    if (generatedComponents !== undefined) updateData.generatedComponents = generatedComponents;
    if (lastPrompt !== undefined) updateData.lastPrompt = lastPrompt;
    if (lastGeneratedJsx !== undefined) updateData.lastGeneratedJsx = lastGeneratedJsx;
    if (lastGeneratedCss !== undefined) updateData.lastGeneratedCss = lastGeneratedCss;
    
    const session = await Session.findByIdAndUpdate(id, updateData, { new: true });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add new chat message and generated code to existing session
router.post('/:id/add-message', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      userMessage, 
      aiMessage, 
      generatedJsx, 
      generatedCss,
      prompt 
    } = req.body;
    
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    
    // Ensure both messages have proper Date objects
    const enhancedUserMessage = {
      ...userMessage,
      prompt: prompt,
      generatedJsx: generatedJsx || '',
      generatedCss: generatedCss || '',
      time: userMessage.time instanceof Date ? userMessage.time : new Date(userMessage.time)
    };
    
    const enhancedAiMessage = {
      ...aiMessage,
      responseText: aiMessage.text,
      time: aiMessage.time instanceof Date ? aiMessage.time : new Date(aiMessage.time)
    };
    
    // Update session with new messages and latest code
    const updatedChatMessages = [...session.chatMessages, enhancedUserMessage, enhancedAiMessage];
    
    const updateData = {
      chatMessages: updatedChatMessages,
      currentJsx: generatedJsx || session.currentJsx,
      currentCss: generatedCss || session.currentCss,
      lastPrompt: prompt,
      lastGeneratedJsx: generatedJsx || session.lastGeneratedJsx,
      lastGeneratedCss: generatedCss || session.lastGeneratedCss,
      generatedComponents: [...(session.generatedComponents || []), generatedJsx].filter(Boolean)
    };
    
    const updatedSession = await Session.findByIdAndUpdate(id, updateData, { new: true });
    
    res.json({ success: true, data: updatedSession });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndDelete(id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router; 