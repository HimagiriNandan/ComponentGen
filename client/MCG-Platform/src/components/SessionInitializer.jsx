import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSessions, setActiveSession } from '../store/slices/sessionsSlice';
import SessionService from '../services/sessionService';

const SessionInitializer = () => {
  const dispatch = useDispatch();
  const { sessions, activeSession } = useSelector(state => state.sessions);

  useEffect(() => {
    const initializeSessions = async () => {
      try {
        // Fetch all sessions from the API
        const response = await SessionService.getAllSessions();
        if (response.success) {
          const fetchedSessions = response.data;
          dispatch(setSessions(fetchedSessions));

          // If there's an active session in localStorage, try to restore it
          const persistedState = localStorage.getItem('sessionsState');
          if (persistedState) {
            try {
              const parsedState = JSON.parse(persistedState);
              if (parsedState.activeSession && parsedState.activeSession._id) {
                // Find the active session in the fetched sessions
                const activeSessionFromAPI = fetchedSessions.find(
                  session => session._id === parsedState.activeSession._id
                );

                if (activeSessionFromAPI) {
                  // Fetch the full session data
                  const sessionResponse = await SessionService.getSessionById(activeSessionFromAPI._id);
                  if (sessionResponse.success) {
                    dispatch(setActiveSession(sessionResponse.data));
                  }
                }
              }
            } catch (error) {
              console.error('Error parsing persisted session state:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    // Only initialize if sessions are empty (after page refresh)
    if (sessions.length === 0) {
      initializeSessions();
    }
  }, [dispatch, sessions.length]);

  return null; // This component doesn't render anything
};

export default SessionInitializer; 