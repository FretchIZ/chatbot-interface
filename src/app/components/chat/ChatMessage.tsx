import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import type { Message } from "../../types";

function ActionBtn({ icon, label, onClick, active }: {
  icon: React.ReactNode; label: string; onClick: () => void; active?: boolean;
}) {
  return (
    <motion.button title={label} onClick={onClick}
      className={`p-1.5 rounded-lg transition-all ${
        active ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-foreground/60 hover:bg-white/5"
      }`}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.button>
  );
}

export function UserBubble({ content }: { content: string }) {
  return (
    <motion.div className="flex justify-end"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm bg-secondary border border-border text-sm text-foreground/85 leading-relaxed">
        {content}
      </div>
    </motion.div>
  );
}

export function AssistantBubble({
  msg, copiedId, onCopy,
}: {
  msg: Message; copiedId: number | null; onCopy: (id: number, content: string) => void;
}) {
  const [liked, setLiked] = useState<boolean | null>(null);

  const renderContent = (text: string) =>
    text.split("\n").map((line, i, arr) => {
      if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
        return <strong key={i} className="text-foreground font-semibold">{line.slice(2, -2)}</strong>;
      }
      if (line.startsWith("• ")) {
        const parts = line.slice(2).split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="flex gap-2 my-0.5">
            <span className="text-primary mt-1 flex-shrink-0">·</span>
            <span>
              {parts.map((p, j) =>
                j % 2 === 1 ? <strong key={j} className="text-foreground font-semibold">{p}</strong> : p
              )}
            </span>
          </div>
        );
      }
      return (
        <span key={i}>
          {line}{i < arr.length - 1 && <br />}
        </span>
      );
    });

  return (
    <motion.div className="flex gap-3.5 group"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={12} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground/80 leading-[1.75] space-y-1">
          {renderContent(msg.content)}
        </div>

        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ActionBtn icon={copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
            label="Copy" onClick={() => onCopy(msg.id, msg.content)} active={copiedId === msg.id}
          />
          <ActionBtn icon={<ThumbsUp size={12} />} label="Good response"
            onClick={() => setLiked(true)} active={liked === true}
          />
          <ActionBtn icon={<ThumbsDown size={12} />} label="Bad response"
            onClick={() => setLiked(false)} active={liked === false}
          />
          <ActionBtn icon={<RefreshCw size={12} />} label="Regenerate" onClick={() => {}} />
        </div>
      </div>
    </motion.div>
  );
}

export function ThinkingBubble() {
  return (
    <motion.div className="flex gap-3.5"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={12} className="text-primary" />
      </div>
      <div className="flex items-center gap-2 py-2">
        <span className="text-xs text-muted-foreground/50">Thinking</span>
        <div className="flex gap-1">
          {[0, 150, 300].map((delay) => (
            <motion.div key={delay} className="w-1.5 h-1.5 rounded-full bg-primary/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
