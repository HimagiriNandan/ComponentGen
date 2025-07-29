import axios from 'axios';
import { BACKEND_URL } from '../config/config';

class SessionService {
  // Create a new session
  static async createSession(sessionData) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/sessions`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  // Get all sessions
  static async getAllSessions() {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/sessions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  // Get a single session by ID
  static async getSessionById(sessionId) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  // Update session with new chat message and generated code
  static async addMessageToSession(sessionId, messageData) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/sessions/${sessionId}/add-message`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error adding message to session:', error);
      throw error;
    }
  }

  // Update session (general update)
  static async updateSession(sessionId, updateData) {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/sessions/${sessionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  // Delete session
  static async deleteSession(sessionId) {
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // Generate component and store in session
  static async generateAndStoreComponent(sessionId, prompt, existingSession = null) {
    try {
      // First, generate the component
      const generateResponse = await axios.post(`${BACKEND_URL}/api/llm/generate-component`, {
        prompt: prompt
      });

      if (!generateResponse.data.success || !generateResponse.data.data) {
        throw new Error(generateResponse.data.error || 'Failed to generate component');
      }

      const { jsx: generatedJsx, css: generatedCss } = generateResponse.data.data;

      // Create user message with proper Date object
      const userMessage = {
        id: Date.now().toString(),
        isUser: true,
        text: prompt,
        time: new Date(), // Use Date object instead of string
        prompt: prompt,
        generatedJsx: generatedJsx || '',
        generatedCss: generatedCss || ''
      };

      // Create AI message with proper Date object
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        text: `I've created a component based on your prompt: "${prompt}". Check the 'Preview' and 'Code' tabs on the right!`,
        time: new Date(), // Use Date object instead of string
        responseText: `I've created a component based on your prompt: "${prompt}". Check the 'Preview' and 'Code' tabs on the right!`
      };

      if (sessionId && existingSession) {
        // Update existing session
        const updateResponse = await this.addMessageToSession(sessionId, {
          userMessage,
          aiMessage,
          generatedJsx,
          generatedCss,
          prompt
        });
        return updateResponse;
      } else {
        // Create new session
        const sessionData = {
          prompt: prompt,
          description: `Component generated from: ${prompt}`,
          tags: [],
          componentsCount: 1,
          chatMessages: [userMessage, aiMessage],
          currentJsx: generatedJsx,
          currentCss: generatedCss,
          lastPrompt: prompt,
          lastGeneratedJsx: generatedJsx,
          lastGeneratedCss: generatedCss,
          generatedComponents: [generatedJsx]
        };

        const createResponse = await this.createSession(sessionData);
        return createResponse;
      }
    } catch (error) {
      console.error('Error generating and storing component:', error);
      throw error;
    }
  }

  // Save session state periodically
  static async saveSessionState(sessionId, sessionState) {
    try {
      const response = await this.updateSession(sessionId, sessionState);
      return response;
    } catch (error) {
      console.error('Error saving session state:', error);
      throw error;
    }
  }

  // Helper method to convert string time to Date object
  static convertTimeStringToDate(timeString) {
    if (timeString instanceof Date) {
      return timeString;
    }

    // If it's already a string like "11:26 PM", convert it to a Date
    if (typeof timeString === 'string') {
      const now = new Date();
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':');

      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      now.setHours(hour, parseInt(minutes), 0, 0);
      return now;
    }

    return new Date();
  }

  // Helper method to format chat messages for database storage
  // services/sessionService.js (or wherever you define it)
  static formatChatMessagesForStorage = (messages) =>
    messages.map((msg) => ({
      ...msg,
      time:
        typeof msg.time === "string"
          ? msg.time
          : new Date(msg.time).toISOString(), // 🔐 safe!
      isUser: Boolean(msg.isUser),
    }));

  // Logout function
  static async logout() {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/logout`, {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
}

export default SessionService; 