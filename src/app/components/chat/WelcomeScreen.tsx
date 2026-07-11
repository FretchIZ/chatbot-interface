import { motion } from "motion/react";
import { Sparkles, Pencil, Code2, Brain, BarChart3 } from "lucide-react";
import type { Suggestion } from "../../types";
import { ChatInput } from "./ChatInput";

const SUGGESTIONS: Suggestion[] = [
  { icon: Pencil, label: "Draft content", desc: "Write a pitch deck, blog post, or email", prompt: "Help me write a compelling pitch deck for a new SaaS product aimed at enterprise teams", color: "from-violet-500/10 to-transparent", border: "border-violet-500/20", iconColor: "text-violet-400" },
  { icon: Code2, label: "Write code", desc: "Build features, fix bugs, review PRs", prompt: "Build a type-safe REST API endpoint with JWT authentication in TypeScript and Express", color: "from-sky-500/10 to-transparent", border: "border-sky-500/20", iconColor: "text-sky-400" },
  { icon: Brain, label: "Deep analysis", desc: "Research, reason, compare tradeoffs", prompt: "Walk me through the architectural tradeoffs between microservices and a monolith for a scaling startup", color: "from-emerald-500/10 to-transparent", border: "border-emerald-500/20", iconColor: "text-emerald-400" },
  { icon: BarChart3, label: "Analyze data", desc: "Find patterns and surface insights", prompt: "Analyze this quarterly revenue dataset and identify the key growth drivers and anomalies", color: "from-amber-500/10 to-transparent", border: "border-amber-500/20", iconColor: "text-amber-400" },
];

const CAPABILITIES = ["Web search", "File analysis", "Code execution", "Multi-step reasoning", "Data viz"];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.1 * i, duration: 0.4, ease: "easeOut" },
  }),
};

export function WelcomeScreen({
  input, setInput, onSend, onKey, onResize, textareaRef, isThinking,
}: {
  input: string; setInput: (v: string) => void; onSend: (text?: string) => void;
  onKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onResize: () => void; textareaRef: React.RefObject<HTMLTextAreaElement | null>; isThinking: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 sm:px-6 py-10 sm:py-16">
      <div className="w-full max-w-[860px]">
        <motion.div className="text-center mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl scale-150" />
            <motion.div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={26} className="text-primary" />
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-foreground mb-3 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.025em" }}
          >
            How can I help you<span className="text-primary italic">?</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto px-2">
            An agentic assistant that reasons, searches, writes code, and executes tasks end-to-end.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <ChatInput input={input} setInput={setInput} onSend={() => onSend()}
            onKey={onKey} onResize={onResize} textareaRef={textareaRef} isThinking={isThinking}
          />
        </motion.div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SUGGESTIONS.map(({ icon: Icon, label, desc, prompt, color, border, iconColor }, i) => (
            <motion.button key={label} onClick={() => onSend(prompt)}
              className={`relative flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-br ${color} border ${border} bg-card text-left hover:brightness-110 transition-all group overflow-hidden`}
              custom={i} variants={cardVariants} initial="hidden" animate="visible"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={14} className={iconColor} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/85 mb-0.5">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div className="mt-6 flex flex-wrap gap-1.5 justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          {CAPABILITIES.map((cap) => (
            <span key={cap}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.04] border border-border text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default"
            >
              {cap}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
