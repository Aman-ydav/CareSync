import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Loader2, AlertTriangle, Sparkles } from 'lucide-react'
import api from '@/api/axiosInterceptor'

const ChatInterface = ({ compact = false, onClose }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      content: userMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newUserMessage])
    
    setLoading(true)

    try {
      const response = await api.post('/ai-chat/chat', {
        message: userMessage,
        sessionId: 'main'
      })

      const aiResponse = response.data.data?.response || 'I apologize, but I cannot respond at the moment.'
      
      // Add AI response
      const newAiMessage = {
        id: Date.now() + 1,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, newAiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: "I'm having trouble connecting right now. Please try again later or contact your healthcare provider directly.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
  }

  const exampleQuestions = [
    "What are common symptoms of flu?",
    "How can I improve my sleep?",
    "What foods help boost immunity?",
    "How to manage stress effectively?"
  ]

  if (compact) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {/* Chat Header */}
          <div className="p-4 border-b bg-linear-to-r from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full medical-gradient flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Health Assistant</h3>
                  <p className="text-xs text-muted-foreground">Ask general health questions</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[300px] overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1">Hello {user?.fullName?.split(' ')[0]}!</h4>
                <p className="text-sm text-muted-foreground mb-3 max-w-xs">
                  I'm here to help with general health information
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Not medical advice</span>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-6 h-6">
                    {message.role === 'user' ? (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="w-3 h-3" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="medical-gradient">
                        <Bot className="w-3 h-3 text-primary-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="medical-gradient">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-xl p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="min-h-10 resize-none text-sm"
                rows={1}
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="medical-gradient text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {messages.length === 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {exampleQuestions.slice(0, 4).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5 justify-start"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full medical-gradient flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">CareSync AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Powered by Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs">Informational Only</span>
            </Badge>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full medical-gradient flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">How can I help you today?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                I can provide general health information, wellness tips, and explain medical concepts.
                Remember, I'm not a substitute for professional medical advice.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-3 text-left justify-start"
                    onClick={() => {
                      setInput(question)
                      setTimeout(() => document.getElementById('chat-input')?.focus(), 100)
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8">
                  {message.role === 'user' ? (
                    <>
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="medical-gradient">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.isError
                      ? 'bg-destructive/10 border border-destructive/20'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' && message.isError && (
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Connection Issue</span>
                    </div>
                  )}
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="medical-gradient">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-3">
          <Textarea
            id="chat-input"
            placeholder="Type your health question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="min-h-20 resize-none"
            disabled={loading}
          />
          <Button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            className="medical-gradient text-primary-foreground self-end"
            size="lg"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>For emergencies, contact healthcare professionals</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface