import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, X, Sparkles, ChevronDown, Database, FileText, BarChart3, Brain, Code2, Pencil } from "lucide-react";
import type { AuthUser, HistoryGroup } from "../../types";

const HISTORY_GROUPS: HistoryGroup[] = [
  {
    label: "Today",
    items: [
      { id: 1, title: "TypeScript generics deep dive", icon: Code2 },
      { id: 2, title: "Marketing copy for launch email", icon: Pencil },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { id: 3, title: "Database schema design review", icon: Database },
      { id: 4, title: "Pitch deck narrative outline", icon: FileText },
    ],
  },
  {
    label: "This week",
    items: [
      { id: 5, title: "React performance deep audit", icon: Code2 },
      { id: 6, title: "Competitive analysis notes", icon: BarChart3 },
      { id: 7, title: "API integration architecture", icon: Brain },
    ],
  },
];

export function Sidebar({
  open, onClose, user, activeHistory, onSelectHistory, onNewChat, isMobile,
}: {
  open: boolean; onClose: () => void; user: AuthUser;
  activeHistory: number | null; onSelectHistory: (id: number) => void;
  onNewChat: () => void; isMobile: boolean;
}) {
  const [search, setSearch] = useState("");

  const filtered = HISTORY_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase())),
  })).filter((g) => g.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(180deg, #111114 0%, #0f0f12 100%)" }}>
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/25">
            <Sparkles size={14} className="text-primary" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#111114]" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground/90">Agent</span>
        </div>
        {isMobile && (
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="px-3 mb-3">
        <motion.button onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground bg-white/0 hover:bg-white/5 border border-transparent hover:border-border transition-all"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        >
          <Plus size={14} />
          New conversation
        </motion.button>
      </div>

      <div className="px-3 mb-4">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-border text-xs pl-8 pr-3 py-2 rounded-lg text-foreground/80 placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
            placeholder="Search conversations…"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-4" style={{ scrollbarWidth: "none" }}>
        {filtered.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/35 font-semibold px-2 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ id, title, icon: Icon }) => (
                <motion.button key={id} onClick={() => { onSelectHistory(id); if (isMobile) onClose(); }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center gap-2.5 group ${
                    activeHistory === id
                      ? "bg-primary/10 text-foreground border border-primary/15"
                      : "text-foreground/50 hover:text-foreground/80 hover:bg-white/[0.04]"
                  }`}
                  whileHover={{ x: 2 }}
                  layout
                >
                  <Icon size={11}
                    className={`flex-shrink-0 transition-colors ${
                      activeHistory === id ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                    }`}
                  />
                  <span className="truncate leading-relaxed">{title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto px-3 py-3 border-t border-border/60">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 overflow-hidden">
            {user.name.slice(0, 2).toUpperCase()}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0f12]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground/80 truncate capitalize">{user.name}</p>
            <p className="text-[10px] text-muted-foreground/50 truncate">{user.email}</p>
          </div>
          <ChevronDown size={11} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside className="fixed left-0 top-0 bottom-0 w-[280px] z-50 border-r border-border overflow-hidden"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      className="flex-shrink-0 flex flex-col border-r border-border overflow-hidden"
      animate={{ width: open ? 260 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="w-[260px] flex-shrink-0 h-full overflow-hidden">
        {sidebarContent}
      </div>
    </motion.aside>
  );
}
