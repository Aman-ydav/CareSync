import React from "react";
import { User, Bot, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ChatMessage = ({ message, onFeedback }) => {
  const isUser = message.type === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard!");
  };

  const handleFeedback = (feedback) => {
    onFeedback?.(message, feedback);
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs opacity-75">
            {isUser ? "You" : "CareSync AI"}
          </span>
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
              onClick={handleCopy}
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="whitespace-pre-wrap text-sm">
          {message.content}
        </div>

        {!isUser && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => handleFeedback("good")}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              Helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => handleFeedback("bad")}
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              Not helpful
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;