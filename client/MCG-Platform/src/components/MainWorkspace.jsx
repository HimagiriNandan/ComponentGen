import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveSession,
  updateActiveSession,
  addSession,
} from "../store/slices/sessionsSlice";
import { logout } from "../store/slices/userSlice";
import SessionService from "../services/sessionService";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import WorkspacePanel from "./WorkspacePanel";
import LoadingOverlay from "./LoadingOverlay";

const MainWorkspace = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJsx, setGeneratedJsx] = useState("");
  const [generatedCss, setGeneratedCss] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      isUser: false,
      text: "Hello! I'm your AI assistant. Describe the component you'd like me to create for you.",
      time: new Date().toISOString(),
    },
  ]);
  const [activeTab, setActiveTab] = useState("tsx");
  const [currentView, setCurrentView] = useState("preview");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeSession } = useSelector((state) => state.sessions);

  const formatTimeForDisplay = (time) => {
    try {
      return new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  const convertChatMessagesForDisplay = (messages) =>
    messages.map((message) => ({
      ...message,
      time: formatTimeForDisplay(message.time),
    }));

  const ensureSafeChatMessages = (messages) => {
    if (!Array.isArray(messages)) return [];
    return messages.map((message) => ({
      ...message,
      id: message.id || Date.now().toString(),
      text: message.text || "",
      time: message.time || new Date().toISOString(),
      isUser: Boolean(message.isUser),
    }));
  };

  useEffect(() => {
    if (!generatedJsx && !generatedCss && activeSession) {
      setPrompt(activeSession.prompt || "");
      setGeneratedJsx(activeSession.currentJsx || "");
      setGeneratedCss(activeSession.currentCss || "");

      if (activeSession.chatMessages?.length) {
        const displayMessages = convertChatMessagesForDisplay(activeSession.chatMessages);
        setChatMessages(displayMessages);
      } else {
        setChatMessages([
          {
            id: 1,
            isUser: false,
            text: "Hello! I'm your AI assistant. Describe the component you'd like me to create for you.",
            time: new Date().toISOString(),
          },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoadingSession(true);
        setIsSessionLoaded(false);

        if (activeSession?._id) {
          const response = await SessionService.getSessionById(activeSession._id);
          if (response.success) {
            const sessionData = response.data;

            dispatch(setActiveSession(sessionData));

            setPrompt(sessionData.lastPrompt || sessionData.prompt || "");
            setGeneratedJsx(sessionData.currentJsx || "");
            setGeneratedCss(sessionData.currentCss || "");

            if (sessionData.chatMessages?.length) {
              const displayMessages = convertChatMessagesForDisplay(sessionData.chatMessages);
              setChatMessages(displayMessages);
            } else {
              setChatMessages([
                {
                  id: 1,
                  isUser: false,
                  text: "Hello! I'm your AI assistant. Describe the component you'd like me to create for you.",
                  time: new Date().toISOString(),
                },
              ]);
            }

            if (sessionData.currentJsx || sessionData.currentCss) {
              setCurrentView("preview");
              setActiveTab("tsx");
            }

            setIsSessionLoaded(true);
          }
        } else {
          setPrompt("");
          setGeneratedJsx("");
          setGeneratedCss("");
          setChatMessages([
            {
              id: 1,
              isUser: false,
              text: "Hello! I'm your AI assistant. Describe the component you'd like me to create for you.",
              time: new Date().toISOString(),
            },
          ]);
          setCurrentView("preview");
          setIsSessionLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
        setIsSessionLoaded(true);
      } finally {
        setIsLoadingSession(false);
      }
    };
    fetchSessionData();
  }, []);

  useEffect(() => {
    if (
      isSessionLoaded &&
      !isLoadingSession &&
      activeSession &&
      (generatedJsx || generatedCss || chatMessages.length > 1)
    ) {
      const saveSession = async () => {
        try {
          const storageMessages = SessionService.formatChatMessagesForStorage(chatMessages);
          await SessionService.saveSessionState(activeSession._id, {
            chatMessages: storageMessages,
            currentJsx: generatedJsx,
            currentCss: generatedCss,
          });

          dispatch(
            updateActiveSession({
              chatMessages: storageMessages,
              currentJsx: generatedJsx,
              currentCss: generatedCss,
            })
          );
        } catch (error) {
          console.error("Error saving session:", error);
        }
      };

      const interval = setInterval(saveSession, 30000);
      return () => {
        clearInterval(interval);
        saveSession();
      };
    }
  }, [activeSession, chatMessages, generatedJsx, generatedCss, dispatch, isSessionLoaded, isLoadingSession]);

  const startNewSession = () => {
    setPrompt("");
    setGeneratedJsx("");
    setGeneratedCss("");
    setChatMessages([
      {
        id: 1,
        isUser: false,
        text: "Hello! I'm your AI assistant. Describe the component you'd like me to create for you.",
        time: new Date().toISOString(),
      },
    ]);
    dispatch(setActiveSession(null));
    setCurrentView("preview");
  };

  const generateComponent = async () => {
    if (isLoadingSession || !isSessionLoaded) return;

    if (!prompt.trim()) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          isUser: false,
          text: "Please enter a prompt before generating a component.",
          time: new Date().toISOString(),
        },
      ]);
      return;
    }

    setIsGenerating(true);
    setGeneratedJsx("");
    setGeneratedCss("");

    try {
      const response = await SessionService.generateAndStoreComponent(
        activeSession?._id,
        prompt,
        activeSession
      );

      if (response.success) {
        const sessionData = response.data;

        setGeneratedJsx(sessionData.currentJsx || "");
        setGeneratedCss(sessionData.currentCss || "");

        const displayMessages = convertChatMessagesForDisplay(sessionData.chatMessages || []);
        setChatMessages(displayMessages);

        if (activeSession) {
          dispatch(setActiveSession(sessionData));
        } else {
          dispatch(addSession(sessionData));
        }

        setCurrentView("preview");
        setActiveTab("tsx");
        setPrompt("");
      } else {
        throw new Error(response.error || "Failed to generate component");
      }
    } catch (error) {
      console.error("Error generating component:", error);
      const errorMessage = {
        id: Date.now() + 1,
        isUser: false,
        text: `Error generating component: ${
          error.response?.data?.error || error.message || "Please try again."
        }`,
        time: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      setPrompt("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateComponent();
    }
  };

  const copyCode = () => {
    const codeToCopy = activeTab === "tsx" ? generatedJsx : generatedCss;
    if (codeToCopy) {
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => console.log("Code copied to clipboard!"))
        .catch((err) => console.error("Failed to copy code:", err));
    }
  };

  const downloadComponent = () => {
    if (!generatedJsx && !generatedCss) {
      console.log("No component to download");
      return;
    }

    // Extract component name from JSX code
    let componentName = "Component";
    if (generatedJsx) {
      // Look for function declaration or const declaration
      const functionMatch = generatedJsx.match(/function\s+(\w+)\s*\(/);
      const constMatch = generatedJsx.match(/const\s+(\w+)\s*=/);
      
      if (functionMatch) {
        componentName = functionMatch[1];
      } else if (constMatch) {
        componentName = constMatch[1];
      }
    }

    // Create the combined content
    const combinedContent = `// ${componentName}.jsx
// Generated by ComponentGen

${generatedJsx}

// CSS Styles
const styles = \`${generatedCss}\`;

// Export the component with styles
export { ${componentName} as default, styles };
`;

    // Create and download the file
    const blob = new Blob([combinedContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName}.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    try {
      await SessionService.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if logout fails, clear local state and redirect
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-black overflow-hidden max-w-full">
      {isLoadingSession && <LoadingOverlay />}

      <Sidebar
        chatMessages={ensureSafeChatMessages(chatMessages)}
        isGenerating={isGenerating}
        prompt={prompt}
        setPrompt={setPrompt}
        onSendMessage={generateComponent}
        handleKeyPress={handleKeyPress}
        startNewSession={startNewSession}
        handleLogout={handleLogout}
      />

      <WorkspacePanel
        generatedJsx={generatedJsx}
        generatedCss={generatedCss}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentView={currentView}
        setCurrentView={setCurrentView}
        copyCode={copyCode}
        downloadComponent={downloadComponent}
        handleLogout={handleLogout}
      />

      {selectedElement && (
        <div className="w-80 bg-property-panel-bg border-l border-border p-4 flex-shrink-0 overflow-y-auto">
          {/* Element properties panel content */}
        </div>
      )}
    </div>
  );
};

export default MainWorkspace;
