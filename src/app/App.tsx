import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { AuthUser, Message } from "./types";
import { useIsMobile } from "./hooks/useMediaQuery";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { AuthScreen } from "./components/auth/AuthScreen";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { WelcomeScreen } from "./components/chat/WelcomeScreen";
import { ChatInput } from "./components/chat/ChatInput";
import { UserBubble, AssistantBubble, ThinkingBubble } from "./components/chat/ChatMessage";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("Sonnet 4.6");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [activeHistory, setActiveHistory] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const inChat = messages.length > 0;

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  useEffect(() => {
    if (!isThinking) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!atBottom);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
  };

  useKeyboardShortcuts({
    "Cmd+K": () => document.querySelector<HTMLInputElement>('input[placeholder="Search conversations…"]')?.focus(),
    "Escape": () => { if (isMobile && sidebarOpen) setSidebarOpen(false); },
  });

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isThinking) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const userMsg: Message = { id: Date.now(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.reply },
      ]);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: `**Error:** ${err.message || "Unable to get response"}` },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const copyMessage = (id: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) return <AuthScreen onAuth={setUser} />;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        user={user} activeHistory={activeHistory}
        onSelectHistory={setActiveHistory} onNewChat={() => { setMessages([]); setActiveHistory(null); }}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="pointer-events-none absolute inset-0 z-0"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(217,119,87,0.07) 0%, transparent 70%)" }}
        />

        <Topbar sidebarOpen={sidebarOpen} showOnMobile={isMobile}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onNewChat={() => { setMessages([]); setActiveHistory(null); }}
          selectedModel={selectedModel} onSelectModel={setSelectedModel}
        />

        <div ref={scrollRef} onScroll={handleScroll}
          className="relative z-10 flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a30 transparent" }}
        >
          <AnimatePresence mode="wait">
            {!inChat ? (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <WelcomeScreen input={input} setInput={setInput} onSend={handleSend}
                  onKey={handleKey} onResize={autoResize} textareaRef={textareaRef} isThinking={isThinking}
                />
              </motion.div>
            ) : (
              <motion.div key="chat" className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              >
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <UserBubble key={msg.id} content={msg.content} />
                  ) : (
                    <AssistantBubble key={msg.id} msg={msg} copiedId={copiedId} onCopy={copyMessage} />
                  )
                )}
                {isThinking && <ThinkingBubble />}
                <div ref={bottomRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll to bottom */}
        <AnimatePresence>
          {showScrollBtn && inChat && (
            <motion.button onClick={scrollToBottom}
              className="absolute bottom-24 right-6 z-20 w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            >
              <ChevronDown size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Sticky bottom input */}
        <AnimatePresence>
          {inChat && (
            <motion.div className="relative z-10 flex-shrink-0 px-4 sm:px-6 pb-4 sm:pb-5 pt-3"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-x-0 -top-8 h-8 pointer-events-none"
                style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
              />
              <div className="max-w-[680px] mx-auto">
                <ChatInput input={input} setInput={setInput} onSend={() => handleSend()}
                  onKey={handleKey} onResize={autoResize} textareaRef={textareaRef} isThinking={isThinking}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
