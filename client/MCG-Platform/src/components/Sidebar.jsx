import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Image,
  Settings,
  Save,
  FolderOpen,
  Plus,
  Send,
  Loader2,
  LogOut,
} from "lucide-react";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

const Sidebar = ({
  chatMessages,
  isGenerating,
  prompt,
  setPrompt,
  onSendMessage,
  handleKeyPress,
  startNewSession,
}) => {
  return (
    <div className="w-80 min-w-80 bg-black border-r border-border flex flex-col shadow-sidebar flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shadow-header">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-button">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">
              ComponentGen
            </h1>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full justify-start bg-primary/10 text-primary border-primary/20 shadow-button hover:shadow-button-hover"
            onClick={startNewSession}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start shadow-button hover:shadow-button-hover"
            onClick={() => {
              window.location.href = "/sessions";
            }}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Load Session
          </Button>
        </div>
      </div>

      {/* Chat Messages with ScrollArea */}
      <ChatWindow chatMessages={chatMessages} isGenerating={isGenerating} />

      {/* Input Section */}
      <ChatInput
        prompt={prompt}
        setPrompt={setPrompt}
        onSendMessage={onSendMessage}
        handleKeyPress={handleKeyPress}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default Sidebar;