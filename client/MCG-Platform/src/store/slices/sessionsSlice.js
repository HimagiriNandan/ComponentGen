import { createSlice } from '@reduxjs/toolkit';

const LOCAL_STORAGE_KEY = 'sessionsState';
const sanitizeChatMessages = (messages) =>
  messages.map((msg) => ({
    ...msg,
    time:
      typeof msg.time === 'string'
        ? msg.time
        : new Date(msg.time).toISOString(),
  }));

const getInitialState = () => {
  const persisted = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (persisted) {
    try {
      return JSON.parse(persisted);
    } catch {
      return {
        sessions: [],
        activeSession: null,
      };
    }
  }
  return {
    sessions: [],
    activeSession: null,
  };
};

const persistState = (state) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: getInitialState(),
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload;
      persistState(state);
    },
    addSession: (state, action) => {
      state.sessions.unshift(action.payload);
      state.activeSession = action.payload;
      persistState(state);
    },
    deleteSession: (state, action) => {
      state.sessions = state.sessions.filter(s => s._id !== action.payload);
      if (state.activeSession && state.activeSession._id === action.payload) {
        state.activeSession = state.sessions[0] || null;
      }
      persistState(state);
    },
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
      persistState(state);
    },
    updateActiveSession: (state, action) => {
      if (state.activeSession) {
        const updatedPayload = { ...action.payload };

        if (updatedPayload.chatMessages) {
          updatedPayload.chatMessages = sanitizeChatMessages(updatedPayload.chatMessages);
        }

        state.activeSession = {
          ...state.activeSession,
          ...updatedPayload,
        };

        const sessionIndex = state.sessions.findIndex(
          (s) => s._id === state.activeSession._id
        );

        if (sessionIndex !== -1) {
          state.sessions[sessionIndex] = {
            ...state.sessions[sessionIndex],
            ...updatedPayload,
          };
        }

        persistState(state);
      }
    },

  },
});

export const { setSessions, addSession, deleteSession, setActiveSession, updateActiveSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;