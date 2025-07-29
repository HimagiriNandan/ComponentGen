import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";

const ChatWindow = ({ chatMessages, isGenerating }) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full p-4">
        <div className="space-y-4 pb-4">
          {chatMessages.map((message) => (
            <ChatMessage
              key={message.id}
              isUser={message.isUser}
              text={message.text}
              time={message.time}
            />
          ))}
          {isGenerating && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating component...</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatWindow;