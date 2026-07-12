import { useState, Fragment } from "react";
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

  function parseInline(text: string) {
    const parts = text.split(/(\*\*.+?\*\*)/);
    return parts.map((p, j) => {
      if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
        return <strong key={j} className="text-foreground font-semibold">{p.slice(2, -2)}</strong>;
      }
      const codeParts = p.split(/(`[^`]+`)/);
      return codeParts.map((cp, k) => {
        if (cp.startsWith("`") && cp.endsWith("`") && cp.length > 2) {
          return <code key={`${j}-${k}`} className="px-1 py-0.5 rounded bg-white/5 text-[13px] font-mono text-primary">{cp.slice(1, -1)}</code>;
        }
        return cp || null;
      });
    });
  }

  function renderTable(rows: string[]) {
    if (rows.length < 2) return null;
    const isSep = (r: string) => /^[\s:|:-]+$/.test(r) && r.includes("---");
    const bodyRows = rows.filter((r) => !isSep(r));
    if (bodyRows.length === 0) return null;
    const headCells = bodyRows[0].split("|").filter((c) => c.trim()).map((c) => c.trim());
    return (
      <div key={`t-${rows[0]}`} className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              {headCells.map((h, k) => (
                <th key={k} className="text-left px-3 py-2 text-foreground font-semibold text-xs uppercase tracking-wider">{parseInline(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.slice(1).map((row, ri) => {
              const cells = row.split("|").filter((c) => c.trim()).map((c) => c.trim());
              return (
                <tr key={ri} className="border-b border-border/50 last:border-0">
                  {cells.map((c, ci) => (
                    <td key={ci} className="px-3 py-2 text-foreground/75 text-xs leading-relaxed">{parseInline(c)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let tableRows: string[] | null = null;

    const flushTable = () => {
      if (tableRows && tableRows.length > 0) {
        elements.push(renderTable(tableRows));
        tableRows = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (!tableRows) tableRows = [];
        tableRows.push(line);
        continue;
      }
      flushTable();

      const isSep = /^[-*_]{3,}$/.test(trimmed);
      if (isSep) {
        elements.push(<div key={i} className="my-4 border-t border-border/60" />);
        continue;
      }

      if (trimmed.startsWith("### ")) {
        elements.push(<h3 key={i} className="text-sm font-semibold text-foreground mt-4 mb-1.5">{parseInline(trimmed.slice(4))}</h3>);
        continue;
      }
      if (trimmed.startsWith("## ")) {
        elements.push(<h2 key={i} className="text-base font-semibold text-foreground mt-5 mb-2">{parseInline(trimmed.slice(3))}</h2>);
        continue;
      }
      if (trimmed.startsWith("# ")) {
        elements.push(<h1 key={i} className="text-lg font-semibold text-foreground mt-5 mb-2">{parseInline(trimmed.slice(2))}</h1>);
        continue;
      }

      if (trimmed.startsWith("> ")) {
        elements.push(<blockquote key={i} className="border-l-2 border-primary/30 pl-3 my-1.5 text-muted-foreground text-xs italic">{parseInline(trimmed.slice(2))}</blockquote>);
        continue;
      }

      if (/^\d+[.)]\s/.test(trimmed)) {
        const content = trimmed.replace(/^\d+[.)]\s/, "");
        elements.push(
          <div key={i} className="flex gap-2 my-0.5 pl-3">
            <span className="text-primary text-xs mt-0.5 flex-shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
            <span className="text-foreground/80 text-sm leading-relaxed">{parseInline(content)}</span>
          </div>
        );
        continue;
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.slice(2);
        elements.push(
          <div key={i} className="flex gap-2 my-0.5 pl-2">
            <span className="text-primary mt-1 flex-shrink-0 text-xs">·</span>
            <span className="text-foreground/80 text-sm leading-relaxed">{parseInline(content)}</span>
          </div>
        );
        continue;
      }

      if (trimmed.startsWith("• ")) {
        const content = trimmed.slice(2);
        elements.push(
          <div key={i} className="flex gap-2 my-0.5 pl-2">
            <span className="text-primary mt-1 flex-shrink-0 text-xs">·</span>
            <span className="text-foreground/80 text-sm leading-relaxed">{parseInline(content)}</span>
          </div>
        );
        continue;
      }

      if (trimmed === "") {
        elements.push(<div key={i} className="h-2" />);
        continue;
      }

      elements.push(
        <p key={i} className="text-foreground/80 text-sm leading-relaxed">{parseInline(trimmed)}</p>
      );
    }

    flushTable();
    return elements;
  };

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
