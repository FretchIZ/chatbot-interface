import { motion } from "motion/react";
import { Paperclip, Globe, Mic, ArrowUp } from "lucide-react";

function ToolBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button title={label}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground/60 hover:bg-white/5 transition-all text-xs"
    >
      {icon}
    </button>
  );
}

export function ChatInput({
  input, setInput, onSend, onKey, onResize, textareaRef, isThinking,
}: {
  input: string; setInput: (v: string) => void; onSend: () => void;
  onKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onResize: () => void; textareaRef: React.RefObject<HTMLTextAreaElement | null>; isThinking: boolean;
}) {
  const canSend = input.trim().length > 0 && !isThinking;

  return (
    <motion.div
      className="relative rounded-2xl border transition-all duration-200"
      style={{
        background: "#161618",
        borderColor: input ? "rgba(217,119,87,0.25)" : "rgba(255,255,255,0.08)",
        boxShadow: input ? "0 0 0 3px rgba(217,119,87,0.06), 0 8px 32px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.3)",
      }}
      animate={canSend ? { borderColor: "rgba(217,119,87,0.40)" } : {}}
      transition={{ duration: 0.3 }}
    >
      <textarea
        ref={textareaRef} value={input}
        onChange={(e) => { setInput(e.target.value); onResize(); }}
        onKeyDown={onKey}
        placeholder="Ask anything…"
        rows={1}
        className="w-full resize-none bg-transparent text-sm text-foreground/85 placeholder:text-muted-foreground/35 leading-relaxed px-4 pt-4 pb-14 focus:outline-none"
        style={{ maxHeight: "220px", scrollbarWidth: "none" }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-0.5">
          <ToolBtn icon={<Paperclip size={14} />} label="Attach file" />
          <ToolBtn icon={<Globe size={14} />} label="Search web" />
          <ToolBtn icon={<Mic size={14} />} label="Voice input" />
          <div className="w-px h-3.5 bg-border mx-1.5" />
          <span className="text-[10px] text-muted-foreground/30 font-medium hidden sm:inline">Shift + Enter for newline</span>
        </div>

        <motion.button
          onClick={onSend} disabled={!canSend}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
            canSend
              ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
              : "bg-white/5 text-muted-foreground/30 cursor-not-allowed"
          }`}
          whileHover={canSend ? { scale: 1.1 } : {}}
          whileTap={canSend ? { scale: 0.9 } : {}}
          animate={canSend ? { rotate: [0, -10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isThinking ? (
            <div className="w-3 h-3 rounded-sm bg-current opacity-70 animate-pulse" />
          ) : (
            <ArrowUp size={15} />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
