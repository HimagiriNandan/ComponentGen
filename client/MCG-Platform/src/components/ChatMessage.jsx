import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

const ChatMessage = ({ isUser = false, text, time }) => {
  // Helper function to format time for display
  const formatTimeForDisplay = (timeValue) => {
    if (timeValue instanceof Date) {
      return timeValue.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    // If it's already a string, return as is
    if (typeof timeValue === "string") {
      return timeValue;
    }
    // Fallback
    return "Unknown time";
  };

  const displayTime = formatTimeForDisplay(time);

  return (
    <div className="flex items-start space-x-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback
          className={
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className={`${isUser ? "bg-accent" : "bg-muted"} rounded-lg p-3`}>
          <p
            className={`text-sm ${
              isUser ? "text-accent-foreground" : "text-muted-foreground"
            } break-words`}
          >
            {text}
          </p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 block">{displayTime}</span>
      </div>
    </div>
  );
};

export default ChatMessage;