import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Plus, ChevronDown } from "lucide-react";
import type { Model } from "../../types";

const MODELS: Model[] = [
  { name: "Opus 4", desc: "Most capable", badge: "Powerful" },
  { name: "Sonnet 4.6", desc: "Fast & intelligent", badge: "Recommended" },
  { name: "Haiku 4.5", desc: "Fastest responses", badge: "Speed" },
];

export function Topbar({
  onToggleSidebar, onNewChat, selectedModel, onSelectModel,
}: {
  onToggleSidebar: () => void; onNewChat: () => void;
  selectedModel: string; onSelectModel: (name: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-border/40 flex-shrink-0 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <motion.button onClick={onToggleSidebar}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          <Menu size={15} />
        </motion.button>
        <div className="w-px h-4 bg-border mx-1" />
        <motion.button onClick={onNewChat}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          <Plus size={13} />
          New
        </motion.button>
      </div>

      <div className="relative">
        <motion.button onClick={() => setShowMenu((v) => !v)}
          className={`flex items-center gap-2 text-sm px-3.5 py-1.5 rounded-xl border transition-all ${
            showMenu ? "bg-secondary border-border text-foreground" : "border-transparent text-foreground/60 hover:text-foreground hover:bg-secondary hover:border-border"
          }`}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-medium text-xs">{selectedModel}</span>
          <motion.div animate={{ rotate: showMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={12} className="text-muted-foreground" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <motion.div className="absolute top-full right-0 mt-2 w-52 bg-popover border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 py-1.5"
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                {MODELS.map((m) => (
                  <button key={m.name} onClick={() => { onSelectModel(m.name); setShowMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-3 ${
                      m.name === selectedModel ? "text-foreground bg-white/[0.06]" : "text-foreground/60 hover:text-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-xs">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 ${
                      m.name === selectedModel ? "bg-primary/15 text-primary" : "bg-white/5 text-muted-foreground/50"
                    }`}>
                      {m.badge}
                    </span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
