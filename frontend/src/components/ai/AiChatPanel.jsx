// AiChatPanel.jsx - Updated with proper scroll and height management
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendAiMessage,
  fetchChatHistory,
  clearChatHistory,
} from "@/features/aiChat/aiChatSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, Trash2, Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AiChatPanel = ({ sessionId = "default" }) => {
  const dispatch = useDispatch();
  const { sessions, sending, loadingHistory } = useSelector(
    (state) => state.aiChat
  );
  const session = sessions[sessionId] || { messages: [] };

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatHistory({ sessionId }));
  }, [dispatch, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    dispatch(sendAiMessage({ message: trimmed, sessionId }));
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all chat history?")) {
      dispatch(clearChatHistory({ sessionId }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-full flex justify-center" ref={containerRef}>
      <Card className="w-full h-full flex flex-col overflow-hidden border shadow-lg rounded-xl">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b bg-linear-to-r from-primary/5 to-primary/10 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                CareSync AI Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask health & wellness questions • Not a substitute for
                professional medical advice
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={
              loadingHistory || sending || session.messages.length === 0
            }
            className="h-9 gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* Chat body - Fixed height with scroll */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Messages scroll area - Fixed height */}
          <ScrollArea className="flex-1 p-4 md:p-6 min-h-0">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading conversation...
                  </p>
                </div>
              </div>
            ) : session.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Start a Conversation
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  Ask CareSync AI about health, wellness, nutrition, or fitness.
                  Remember, I cannot diagnose medical conditions.
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                  <span className="px-3 py-1.5 bg-muted/50 rounded-full">
                    "Healthy meal ideas"
                  </span>
                  <span className="px-3 py-1.5 bg-muted/50 rounded-full">
                    "Exercise tips"
                  </span>
                  <span className="px-3 py-1.5 bg-muted/50 rounded-full">
                    "Sleep better"
                  </span>
                  <span className="px-3 py-1.5 bg-muted/50 rounded-full">
                    "Stress management"
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {session.messages.map((m, i) => (
                  <div key={i} className="space-y-4">
                    {/* User message */}
                    <div className="flex gap-3 max-w-full">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-foreground">
                            You
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 text-sm text-primary">
                          {m.message}
                        </div>
                      </div>
                    </div>

                    {/* AI response with max height and scroll */}
                    <div className="flex gap-3 max-w-full">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-foreground">
                            CareSync AI
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="bg-muted/30 rounded-2xl rounded-tl-none px-4 py-3">
                          <div
                            className="prose prose-sm max-w-none text-sm text-foreground max-h-64 overflow-y-auto pr-2"
                            dangerouslySetInnerHTML={{
                              __html: m.response.replace(/\n/g, "<br />"),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input area - Fixed height */}
          <div className="border-t bg-background/95 backdrop-blur-sm px-4 py-4 shrink-0">
            <div className="flex items-end gap-3 max-w-3xl mx-auto ">
              <Textarea
                ref={textareaRef}
                rows={1}
                placeholder="Type your health or wellness question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                
                className="min-h-11 max-h-32 text-sm resize-none rounded-2xl px-4 py-3 flex-1 shadow-sm border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary scrollbar-hide"
              />
              <Button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="h-11 w-11 rounded-full p-0 shadow-md hover:shadow-lg transition-shadow"
                size="icon"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AiChatPanel;
