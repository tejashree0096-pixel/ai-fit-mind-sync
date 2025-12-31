import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Dumbbell,
  Apple,
  Heart,
  Mic
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: Dumbbell, text: "Suggest today's workout" },
  { icon: Apple, text: "What should I eat?" },
  { icon: Heart, text: "I'm feeling stressed" },
  { icon: Sparkles, text: "Motivate me!" },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hey there! 👋 I'm your AI Fitness Coach. I've analyzed your profile and I'm here to help you with personalized workout plans, nutrition advice, and motivation. How can I assist you today?",
    timestamp: new Date(),
  },
];

const Coach = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      return "Based on your intermediate level and muscle gain goal, I suggest a push-pull-legs split today. 💪\n\n**Today's Focus: Push Day**\n• Bench Press: 4×8-10\n• Overhead Press: 3×10-12\n• Incline Dumbbell Press: 3×12\n• Tricep Dips: 3×12\n• Lateral Raises: 3×15\n\nThis targets chest, shoulders, and triceps. Rest 60-90 seconds between sets. Ready to start?";
    }
    
    if (lowerMessage.includes("eat") || lowerMessage.includes("food") || lowerMessage.includes("meal")) {
      return "Looking at your macros today, you're low on protein! 🥗\n\n**Meal Suggestions:**\n• Paneer bhurji with 2 chapatis (35g protein)\n• Greek yogurt with mixed nuts (15g protein)\n• Soya chunks curry with rice (25g protein)\n\nThis will help you hit your 120g daily protein target. Want me to generate a full meal plan?";
    }
    
    if (lowerMessage.includes("stressed") || lowerMessage.includes("tired") || lowerMessage.includes("exhausted")) {
      return "I can sense you're feeling overwhelmed. 🧘‍♂️ It's completely okay!\n\n**Let's adjust today's plan:**\n1. Skip the intense workout\n2. Do a 15-min gentle yoga session\n3. Focus on deep breathing (4-7-8 technique)\n4. Prioritize 8 hours of sleep tonight\n\nRemember: Rest is part of the process. Your body recovers and grows during rest. Take care! 💙";
    }
    
    if (lowerMessage.includes("motivate") || lowerMessage.includes("motivation")) {
      return "You've got this! 🔥\n\nRemember why you started. Every rep counts, every healthy meal matters.\n\n**Your Progress This Week:**\n• 4/5 workouts completed ✅\n• Protein goals hit 3 days ✅\n• You're getting stronger!\n\n*\"The body achieves what the mind believes.\"*\n\nLet's make today count! What's your first win going to be?";
    }
    
    return "I'm here to help with your fitness journey! 🎯\n\nYou can ask me about:\n• Personalized workout plans\n• Nutrition & diet advice\n• Recovery and wellness tips\n• Motivation when you need it\n\nWhat would you like to focus on?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (text: string) => {
    setInput(text);
  };

  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="glass-card mx-4 mt-4 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-400 to-pink-500">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg">AI Fitness Coach</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
                <span>•</span>
                <span>Adaptive & Personalized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-to-br from-violet-400 to-pink-500"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "glass-card rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-60 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="glass-card p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
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
              onClick={() => handleQuickPrompt(prompt.text)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
            >
              <prompt.icon className="w-4 h-4 text-primary" />
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 glass-card mx-4 mb-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
              <Mic className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Ask your AI coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-secondary/50 border-0 rounded-xl"
            />
            <Button
              variant="gradient"
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="rounded-full flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Coach;
