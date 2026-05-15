import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, Bot, User, Sparkles, Dumbbell, Apple, Heart, Mic, MicOff, Trash2, Loader2
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: Dumbbell, text: "Create a workout plan for today" },
  { icon: Apple, text: "What should I eat for muscle gain?" },
  { icon: Heart, text: "I'm feeling stressed and tired" },
  { icon: Sparkles, text: "Analyze my progress this week" },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach-chat`;

const Coach = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey there! 👋 I'm your **AI Fitness Coach**. I have access to your profile and progress data, so I can give you truly personalized advice.\n\nAsk me about:\n- 🏋️ Custom workout plans\n- 🥗 Nutrition & diet advice\n- 📊 Progress analysis\n- 🧘 Recovery & wellness\n\nWhat would you like to focus on today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Load profile data from the database (no client-side caching of sensitive health data)
  const getUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    return data;
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const profile = await getUserProfile();
    const chatHistory = [...messages.filter(m => m.id !== "welcome"), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in to chat with the coach.");
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: chatHistory, userProfile: profile }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { id: assistantId, role: "assistant", content: assistantContent, timestamp: new Date() }];
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${e.message}. Please try again.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  // Voice input
  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat cleared! How can I help you today? 💪",
      timestamp: new Date(),
    }]);
  };

  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="glass-card mx-4 mt-4 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-400 to-pink-500">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-semibold text-lg">AI Fitness Coach</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isStreaming ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
                    {isStreaming ? "Thinking..." : "Online"}
                  </span>
                  <span>•</span>
                  <span>Powered by AI</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearChat} className="rounded-full">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gradient-to-br from-violet-400 to-pink-500"
              }`}>
                {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "glass-card rounded-tl-none"
              }`}>
                <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <span className="text-xs opacity-60 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="glass-card p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:100ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:200ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSend(prompt.text)}
              disabled={isStreaming}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <prompt.icon className="w-4 h-4 text-primary" />
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 glass-card mx-4 mb-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full flex-shrink-0 ${isListening ? "bg-destructive/20 text-destructive" : ""}`}
              onClick={toggleVoice}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Input
              placeholder="Ask your AI coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="flex-1 bg-secondary/50 border-0 rounded-xl"
              disabled={isStreaming}
            />
            <Button
              variant="gradient"
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isStreaming}
              className="rounded-full flex-shrink-0"
            >
              {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Coach;
