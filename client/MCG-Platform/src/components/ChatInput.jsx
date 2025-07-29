import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Send, Save } from "lucide-react";

const ChatInput = ({
  prompt,
  setPrompt,
  onSendMessage,
  handleKeyPress,
  isGenerating,
}) => {
  return (
    <div className="p-4 border-t border-border shadow-header">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Describe your component..."
            className="bg-muted/50 pr-20 shadow-input focus:shadow-input-focus"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isGenerating}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
            <Button size="sm" variant="ghost" className="p-1 shadow-button">
              <Image className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 shadow-button"
              onClick={onSendMessage}
              disabled={isGenerating || !prompt.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <Badge variant="outline" className="text-xs shadow-badge">
          <Save className="w-3 h-3 mr-1" /> Auto-saved
        </Badge>
      </div>
    </div>
  );
};

export default ChatInput;