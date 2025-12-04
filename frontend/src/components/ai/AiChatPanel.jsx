import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendAiMessage,
  fetchChatHistory,
  clearChatHistory,
} from "@/features/aiChat/aiChatSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";

const AiChatPanel = ({ sessionId = "default" }) => {
  const dispatch = useDispatch();
  const { sessions, sending, loadingHistory } = useSelector((state) => state.aiChat);
  const session = sessions[sessionId] || { messages: [] };

  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchChatHistory({ sessionId }));
  }, [dispatch, sessionId]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    dispatch(sendAiMessage({ message: trimmed, sessionId }));
    setMessage("");
  };

  const handleClear = () => {
    dispatch(clearChatHistory({ sessionId }));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm">CareSync AI Assistant</CardTitle>
            <p className="text-xs text-muted-foreground">
              Ask general health & wellness questions (non-diagnostic).
            </p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={handleClear}
          disabled={loadingHistory || sending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex-1 rounded-md border bg-muted/40 p-3 overflow-y-auto space-y-3 text-xs">
          {loadingHistory ? (
            <p className="text-muted-foreground text-xs">Loading chat history...</p>
          ) : session.messages.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              Start a conversation with CareSync AI. Remember: it cannot give real diagnoses.
            </p>
          ) : (
            session.messages.map((m, idx) => (
              <div key={idx} className="space-y-2 border-b border-border/40 pb-2 last:border-none">
                <div className="flex gap-2">
                  <span className="font-semibold text-[11px]">You</span>
                  <p className="text-[11px]">{m.message}</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-[11px]">CareSync AI</span>
                  <div className="text-[11px] prose prose-xs dark:prose-invert max-w-none">
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: m.response.replace(/\n/g, "<br />") }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            rows={3}
            placeholder="Type your question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="text-xs"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSend} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Sending...
                </>
              ) : (
                "Ask CareSync AI"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiChatPanel;
