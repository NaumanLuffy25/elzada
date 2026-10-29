"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Send,
  Sparkles,
  User,
  X,
  Bot,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Minus,
} from "lucide-react";
import { cn, uid } from "@/lib/utils";
import { toast } from "sonner";

type Source = { doc: { id: string; title: string; category: string }; score: number; evidencePassed?: boolean };

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
  sources?: Source[];
  evidenceSources?: Array<{ id: string; title: string; category: string; score: number }>;
  intent?: string;
  confidence?: number;
  latency_ms?: number;
  feedback?: "up" | "down";
  grounded?: boolean;
  responseType?:
    | "grounded"
    | "fallback_no_info"
    | "out_of_scope"
    | "policy_violation"
    | "greeting"
    | "dataset_error";
};

const SUGGESTIONS: { label: string; icon?: string }[] = [
  { label: "What B.Tech programs does EIT offer?" },
  { label: "B.Tech 2025 admission dates and eligibility?" },
  { label: "What is the 2025-26 B.Tech annual tuition fee?" },
  { label: "Highest placement CTC in 2023-24?" },
  { label: "Tell me about on-campus hostel and mess facilities." },
  { label: "Scholarships available for B.Tech students?" },
];

export function Chatbot({
  embedded = false,
  initialOpen = false,
  onClose,
}: {
  embedded?: boolean;
  initialOpen?: boolean;
  onClose?: () => void;
}) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: uid("m"),
      role: "assistant",
      content:
        "Welcome to Elzada! I'm Elzada AI, your 24×7 admission counsellor. Ask me anything about admissions, programs, eligibility, fees, placements, scholarships, or campus life at EIT, Yelahanka, Bengaluru.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sessionId = React.useRef<string>(uid("s"));

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function resetChat() {
    sessionId.current = uid("s");
    setMessages([
      {
        id: uid("m"),
        role: "assistant",
        content:
          "Hi there! I'm Elzada AI — your 24×7 admission counsellor. Ask me anything about EIT, Yelahanka, Bengaluru.",
      },
    ]);
    toast.message("Chat reset", { description: "Started a fresh session." });
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const userMsg: Message = { id: uid("m"), role: "user", content };
    setMessages((m) => [...m, userMsg]);
    const placeholder: Message = {
      id: uid("m"),
      role: "assistant",
      content: "",
      pending: true,
    };
    setMessages((m) => [...m, placeholder]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          sessionId: sessionId.current,
        }),
      });
      const data = await res.json();
      setMessages((m) =>
        m.map((msg) =>
          msg.id === placeholder.id
            ? {
                ...msg,
                pending: false,
                content: data.answer ||
                  "I'm sorry, but I couldn't find verified information about this in the official Elzada Institute of Technology knowledge base. Please contact the college administration for confirmation.",
                sources: data.sources,
                evidenceSources: data.evidenceSources,
                intent: data.intent,
                confidence: data.confidence,
                latency_ms: data.latency_ms,
                grounded: Boolean(data.grounded),
                responseType: data.responseType,
              }
            : msg,
        ),
      );
    } catch (err: any) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === placeholder.id
            ? {
                ...msg,
                pending: false,
                content:
                  "Sorry, I'm having trouble reaching the server right now. Please try again in a moment, or call +91-80-6123-4567.",
              }
            : msg,
        ),
      );
      toast.error("Chat request failed", {
        description: "Please check your connection and retry.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function feedback(msg: Message, value: "up" | "down") {
    setMessages((m) => m.map((x) => (x.id === msg.id ? { ...x, feedback: value } : x)));
    try {
      await fetch("/api/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: msg.id, feedback: value }),
      });
      toast.success("Thank you for your feedback", {
        description: "It helps us improve the AI assistant.",
      });
    } catch {
      // noop
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        "neu-surface border border-border/40",
        embedded ? "h-[640px]" : "w-full max-w-md h-[640px]",
      )}
    >
      {/* Header */}
      <header className="relative flex items-center gap-3 px-4 py-3.5 border-b border-border/40 bg-card/80 backdrop-blur">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="size-10 rounded-2xl bg-gradient-to-br from-elzada-400 via-elzada-600 to-navy-800 grid place-items-center shadow-md">
            <Bot className="size-5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse-soft" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
            Elzada AI Counsellor
            <span className="chip !text-[9px] !py-0.5 !px-2 !font-bold tracking-[0.18em] uppercase text-primary border-primary/30">
              24×7
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3 text-gold-500" /> RAG + Intent + BM25 · 150+ topics
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={resetChat}
            aria-label="Reset chat"
            title="Reset chat"
            className="neu-icon-btn !size-9"
          >
            <RotateCcw className="size-4" />
          </button>
          {!embedded ? null : (
            <button
              onClick={onClose}
              aria-label="Minimize"
              title="Minimize"
              className="neu-icon-btn !size-9 hidden sm:grid"
            >
              <Minus className="size-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close chat"
              title="Close chat"
              className="neu-icon-btn !size-9"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-4 space-y-4 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onFeedback={feedback} />
          ))}
        </AnimatePresence>

        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="space-y-2 pt-1"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground px-1">
              Try asking
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  onClick={() => send(s.label)}
                  className="neu-surface-xs text-left px-3.5 py-2.5 text-[13px] font-medium text-foreground/85 hover:text-primary transition-colors flex items-center justify-between gap-3 group"
                >
                  <span>{s.label}</span>
                  <Sparkles className="size-3.5 text-gold-500 opacity-70 group-hover:opacity-100 shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-border/40 bg-card/70 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 neu-inset px-3 py-2 rounded-2xl flex items-center">
            <Sparkles className="size-4 text-primary/70 mr-2 shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about admissions, fees, placements, hostel…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="neu-btn-primary !rounded-2xl !p-0 size-11 shrink-0 grid place-items-center disabled:!opacity-50"
            aria-label="Send message"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground/80 mt-2 px-1 text-center">
          Elzada AI answers from verified knowledge base. For complex decisions, contact admissions.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onFeedback,
}: {
  message: Message;
  onFeedback: (m: Message, v: "up" | "down") => void;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex gap-2 sm:gap-2.5",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="shrink-0 size-8 rounded-xl bg-gradient-to-br from-primary/25 to-navy-700/15 grid place-items-center border border-primary/20 text-primary">
          <Bot className="size-4" />
        </div>
      )}
      <div className={cn("max-w-[84%] sm:max-w-[82%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-[13.5px] sm:text-sm whitespace-pre-wrap leading-relaxed",
            isUser
              ? "neu-pressed text-foreground rounded-br-md"
              : "neu-surface-xs !bg-card rounded-bl-md text-foreground/95 border border-border/30",
          )}
        >
          {message.pending ? (
            <div className="flex items-center gap-1.5 text-muted-foreground/80 py-0.5">
              <span className="size-2 rounded-full bg-primary/50 animate-bounce" />
              <span
                className="size-2 rounded-full bg-primary/50 animate-bounce"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="size-2 rounded-full bg-primary/50 animate-bounce"
                style={{ animationDelay: "240ms" }}
              />
            </div>
          ) : (
            <Formatted text={message.content} />
          )}
        </div>

        {!isUser && !message.pending && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-muted-foreground">
            {message.responseType === "grounded" && (
              <span className="chip !text-[10px] !py-0.5 !px-2 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5">
                ✓ Verified from dataset
              </span>
            )}
            {message.responseType === "fallback_no_info" && (
              <span className="chip !text-[10px] !py-0.5 !px-2 text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5">
                ⚠ Not in knowledge base
              </span>
            )}
            {message.responseType === "out_of_scope" && (
              <span className="chip !text-[10px] !py-0.5 !px-2 text-sky-600 dark:text-sky-400 border-sky-500/30 bg-sky-500/5">
                ℹ Out of scope
              </span>
            )}
            {message.responseType === "policy_violation" && (
              <span className="chip !text-[10px] !py-0.5 !px-2 text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/5">
                🛡 Dataset-only mode
              </span>
            )}
            {message.responseType === "greeting" && (
              <span className="chip !text-[10px] !py-0.5 !px-2 text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/5">
                👋 Greeting
              </span>
            )}
            {typeof message.latency_ms === "number" && (
              <span className="chip !text-[10px] !py-0.5 !px-2">
                ⚡ {message.latency_ms}ms
              </span>
            )}
            {typeof message.confidence === "number" && message.responseType === "grounded" && (
              <span className={cn(
                "chip !text-[10px] !py-0.5 !px-2",
                message.confidence > 0.8 ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30" :
                message.confidence > 0.5 ? "text-amber-600 dark:text-amber-400 border-amber-500/30" :
                "text-red-600 dark:text-red-400 border-red-500/30"
              )}>
                ✓ {(message.confidence * 100).toFixed(0)}% conf
              </span>
            )}
            {message.intent && (
              <span className="chip !text-[10px] !py-0.5 !px-2 text-primary border-primary/30">
                {message.intent}
              </span>
            )}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => onFeedback(message, "up")}
                aria-label="Helpful"
                title="Helpful"
                className={cn(
                  "p-1 rounded-md transition-colors",
                  message.feedback === "up"
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <ThumbsUp className="size-3.5" />
              </button>
              <button
                onClick={() => onFeedback(message, "down")}
                aria-label="Not helpful"
                title="Not helpful"
                className={cn(
                  "p-1 rounded-md transition-colors",
                  message.feedback === "down"
                    ? "text-red-500 bg-red-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <ThumbsDown className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {message.evidenceSources && message.evidenceSources.length > 0 && !message.pending && (
          <details className="mt-2 group">
            <summary className="cursor-pointer text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-primary transition-colors inline-flex items-center gap-1 select-none">
              <span>✓ {message.evidenceSources.length} verifying dataset record{message.evidenceSources.length > 1 ? "s" : ""}</span>
            </summary>
            <ul className="mt-1.5 space-y-1.5 text-[11px]">
              {message.evidenceSources.slice(0, 4).map((s, i) => (
                <li
                  key={s.id + i}
                  className="neu-pressed rounded-lg px-2.5 py-1.5 border-l-2 border-emerald-500/50"
                >
                  <span className="text-foreground/90 font-medium">[{i + 1}] {s.title}</span>{" "}
                  <span className="text-[10px] text-muted-foreground/80">
                    · {s.category} · {(s.score * 100).toFixed(0)}% evidence score
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {message.sources && message.sources.length > 0 && !message.pending && (!message.evidenceSources || message.evidenceSources.length === 0) && (
          <details className="mt-2 group">
            <summary className="cursor-pointer text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 select-none">
              <span>📚 {message.sources.length} related knowledge-base item{message.sources.length > 1 ? "s" : ""}</span>
            </summary>
            <ul className="mt-1.5 space-y-1.5 text-[11px] text-muted-foreground">
              {message.sources.slice(0, 4).map((s, i) => (
                <li
                  key={i}
                  className="neu-pressed rounded-lg px-2.5 py-1.5"
                >
                  [{i + 1}] <span className="text-foreground/75 font-medium">{s.doc.title}</span>{" "}
                  <span className="text-[10px] text-muted-foreground/70">
                    · {s.doc.category} · {(s.score * 100).toFixed(0)}% match
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
      {isUser && (
        <div className="shrink-0 size-8 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 grid place-items-center border border-gold-500/20 text-gold-600 dark:text-gold-400">
          <User className="size-4" />
        </div>
      )}
    </motion.div>
  );
}

function Formatted({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const lines = text.split("\n");
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      parts.push(
        <div key={idx} className="flex gap-2 my-0.5">
          <span className="mt-2 size-1.5 rounded-full bg-gold-500 shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: renderInline(trimmed.replace(/^[-•]\s*/, "")) }} />
        </div>,
      );
    } else if (trimmed.match(/^\d+\.\s/)) {
      parts.push(
        <div key={idx} className="flex gap-2 my-0.5">
          <span className="mt-0.5 font-bold text-[11px] text-primary shrink-0">
            {trimmed.match(/^\d+/)?.[0]}.
          </span>
          <span dangerouslySetInnerHTML={{ __html: renderInline(trimmed.replace(/^\d+\.\s*/, "")) }} />
        </div>,
      );
    } else {
      parts.push(<p key={idx} dangerouslySetInnerHTML={{ __html: renderInline(line) }} />);
    }
  });
  return <div className="space-y-1">{parts}</div>;
}

function renderInline(text: string) {
  const safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, '$1<em class="text-primary font-medium not-italic">$2</em>')
    .replace(/_([^_\n]+)_/g, '<span class="underline decoration-gold-500/60 decoration-2 underline-offset-2">$1</span>');
}
