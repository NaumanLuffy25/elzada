"use client";

import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, ChevronRight, Loader2, Search, User, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";

import { cn, formatRelative } from "@/lib/utils";
import { adminNavHref } from "@/components/admin/nav-config";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Field,
  Input,
  LoadingState,
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  SearchInput,
  Select,
  Skeleton,
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";

type Session = {
  session_id: string;
  message_count: number;
  first_message: string;
  last_message: string;
  created_at: string;
  intent?: string | null;
  category?: string | null;
};

type Message = {
  id: string;
  session_id: string;
  user_message: string;
  bot_reply: string;
  intent?: string | null;
  category?: string | null;
  confidence?: number | null;
  latency_ms?: number | null;
  created_at: string;
};

const TOKEN_KEY = "elzada_admin_token";
const PAGE_SIZE = 15;

function storedToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function ConversationsTable() {
  const [token, setToken] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [msgPage, setMsgPage] = useState(1);

  useEffect(() => {
    setToken(storedToken());
  }, []);

  const fetchSessions = useCallback(async (currentToken: string | null) => {
    if (!currentToken) {
      setSessions([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Header-only token: keeps it out of URLs and server access logs.
      const res = await fetch("/api/conversations?page=1&limit=100", {
        cache: "no-store",
        headers: { "x-admin-token": currentToken },
      });
      if (res.status === 401) {
        setError(
          "The admin API rejected the token. Set ADMIN_DASHBOARD_TOKEN in .env.local and re-enter it via the Overview.",
        );
        setSessions([]);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`The admin API responded with HTTP ${res.status}.`);
      const json = await res.json();
      setSessions(Array.isArray(json.sessions) ? json.sessions : []);
    } catch (cause: any) {
      setError(cause?.message || "Could not load conversations.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (currentToken: string | null, sessionId: string) => {
      if (!currentToken || !sessionId) return;
      setLoading(true);
      setError(null);
      try {
        // Header-only token: keeps it out of URLs and server access logs.
        const res = await fetch(`/api/conversations?session_id=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
          headers: { "x-admin-token": currentToken },
        });
        if (res.status === 401) {
          setError(
            "The admin API rejected the token. Set ADMIN_DASHBOARD_TOKEN in .env.local and re-enter it via the Overview.",
          );
          setMessages([]);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error(`The admin API responded with HTTP ${res.status}.`);
        const json = await res.json();
        setMessages(Array.isArray(json.messages) ? json.messages : []);
      } catch (cause: any) {
        setError(cause?.message || "Could not load conversation history.");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (token === null) return;
    void fetchSessions(token);
  }, [token, fetchSessions]);

  // Derived: filtered sessions
  const filteredSessions = useMemo(() => {
    const qLower = q.toLowerCase();
    return sessions.filter((s) => {
      const matchQ =
        !qLower ||
        s.session_id.toLowerCase().includes(qLower) ||
        s.first_message.toLowerCase().includes(qLower) ||
        s.last_message.toLowerCase().includes(qLower) ||
        (s.intent ?? "").toLowerCase().includes(qLower) ||
        (s.category ?? "").toLowerCase().includes(qLower);
      return matchQ;
    });
  }, [sessions, q]);

  const pageCount = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const from = (currentPage - 1) * PAGE_SIZE;
  const pageSessions = filteredSessions.slice(from, from + PAGE_SIZE);

  // Derived: current page of messages (chronological, newest last)
  const msgPageCount = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
  const currentMsgPage = Math.min(msgPage, msgPageCount);
  const msgFrom = (currentMsgPage - 1) * PAGE_SIZE;
  const pageMessages = messages.slice(msgFrom, msgFrom + PAGE_SIZE);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQ(e.target.value);
      setPage(1);
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    if (token !== null) void fetchSessions(token);
  }, [token, fetchSessions]);

  const openSession = useCallback(
    (sessionId: string) => {
      setActiveSession(sessionId);
      setMsgPage(1);
      const session = sessions.find((s) => s.session_id === sessionId);
      if (session) {
        // Fetch history if not already loaded for this session
        void fetchMessages(token, sessionId);
      }
    },
    [sessions, token, fetchMessages],
  );

  const closeSession = useCallback(() => {
    setActiveSession(null);
    setMessages([]);
    setMsgPage(1);
  }, []);

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (loading) {
    return (
      <Panel>
        <PanelHeader
          title="Chatbot Conversations"
          description="Saved chatbot transcripts, grouped by session."
          icon={Bot}
        />
        <PanelBody className="flex items-center justify-center py-adm-16">
          <LoadingState label="Loading conversations…" />
        </PanelBody>
      </Panel>
    );
  }

  if (!token) {
    return (
      <Panel>
        <PanelHeader
          title="Chatbot Conversations"
          description="Saved chatbot transcripts, grouped by session."
          icon={Bot}
        />
        <PanelBody className="py-adm-10">
          <Alert tone="info" title="Not authorized to view conversations">
            No admin token is stored in this browser. Enter ADMIN_DASHBOARD_TOKEN in
            .env.local, then paste it via the &quot;Set token&quot; action on the Overview.
          </Alert>
        </PanelBody>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel>
        <PanelHeader
          title="Chatbot Conversations"
          description="Saved chatbot transcripts, grouped by session."
          icon={Bot}
        />
        <PanelBody>
          <ErrorState
            title="Conversations could not be loaded"
            description={error}
            onRetry={() => void fetchSessions(token)}
            retryLabel="Try again"
          />
        </PanelBody>
      </Panel>
    );
  }

  return (
    <Panel>
      {activeSession ? (
        <MessageHistoryView
          sessionId={activeSession}
          messages={messages}
          pageMessages={pageMessages}
          currentMsgPage={currentMsgPage}
          msgPageCount={msgPageCount}
          onClose={closeSession}
          onNextMsgPage={() => setMsgPage(currentMsgPage + 1)}
          onPrevMsgPage={() => setMsgPage(currentMsgPage - 1)}
          loading={loading}
        />
      ) : (
        <SessionListView
          sessions={pageSessions}
          total={filteredSessions.length}
          currentPage={currentPage}
          pageCount={pageCount}
          from={from}
          q={q}
          onSearch={handleSearch}
          onOpenSession={openSession}
          onRefresh={handleRefresh}
          onPrevPage={() => setPage(currentPage - 1)}
          onNextPage={() => setPage(currentPage + 1)}
          loading={loading}
          supabaseConfigured={supabaseConfigured}
        />
      )}
    </Panel>
  );
}

/** Session list: topic, message count, date/time, search, pagination, open. */
function SessionListView({
  sessions,
  total,
  currentPage,
  pageCount,
  from,
  q,
  onSearch,
  onOpenSession,
  onRefresh,
  onPrevPage,
  onNextPage,
  loading,
  supabaseConfigured,
}: {
  sessions: Session[];
  total: number;
  currentPage: number;
  pageCount: number;
  from: number;
  q: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSession: (sessionId: string) => void;
  onRefresh: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  loading: boolean;
  supabaseConfigured: boolean;
}) {
  return (
    <>
      <PanelHeader
        title="Chatbot Conversations"
        description={`${total.toLocaleString("en-IN")} session${total === 1 ? "" : "s"} saved`}
        icon={Bot}
        actions={
          <div className="flex flex-wrap items-center gap-adm-3">
            <SearchInput
              value={q}
              onChange={onSearch}
              placeholder="Search session ID, topic, intent…"
              className="w-[240px] sm:w-[320px]"
            />
            <Button variant="outline" size="sm" onClick={onRefresh} loading={loading}>
              <RefreshCw className="size-3.5" aria-hidden />
              Refresh
            </Button>
          </div>
        }
      />
      <PanelBody className="space-y-adm-4">
        {sessions.length === 0 ? (
          <EmptyState
            icon={Bot}
            title={
              supabaseConfigured && total === 0
                ? "No conversations yet"
                : "No conversations match your search"
            }
            description={
              supabaseConfigured && total === 0
                ? "Chatbot transcripts appear here once visitors submit messages through Elzada AI."
                : "Try a different search term or clear the filter."
            }
          />
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Session</TH>
                  <TH className="hidden sm:table-cell">Topic</TH>
                  <TH className="hidden sm:table-cell">Intent</TH>
                  <TH className="hidden sm:table-cell">Category</TH>
                  <TH className="text-center">Messages</TH>
                  <TH className="text-right">Last activity</TH>
                  <TH className="text-right">Open</TH>
                </TR>
              </THead>
              <TBody>
                {sessions.map((s) => (
                  <TR
                    key={s.session_id}
                    onClick={() => onOpenSession(s.session_id)}
                    className="cursor-pointer hover:bg-adm-surface-2 transition-colors duration-adm ease-adm border-b border-adm-line/50 last:border-b-0 group"
                  >
                    <TD className="px-adm-4 py-adm-3">
                      <div className="font-medium text-adm-fg truncate">{s.session_id}</div>
                      <div className="mt-0.5 text-[11px] text-adm-muted truncate">
                        {s.message_count} message{s.message_count === 1 ? "" : "s"}
                      </div>
                    </TD>
                    <TD className="hidden sm:table-cell px-adm-4 py-adm-3 text-[12px] text-adm-muted truncate">
                      {s.first_message || "—"}
                    </TD>
                    <TD className="hidden sm:table-cell px-adm-4 py-adm-3 text-[12px] text-adm-muted">
                      {s.intent ?? "—"}
                    </TD>
                    <TD className="hidden sm:table-cell px-adm-4 py-adm-3 text-[12px] text-adm-muted">
                      {s.category ?? "—"}
                    </TD>
                    <TD className="px-adm-4 py-adm-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium tabular-nums text-adm-fg">
                        {s.message_count}
                      </span>
                    </TD>
                    <TD className="px-adm-4 py-adm-3 text-[12px] text-adm-muted whitespace-nowrap text-right">
                      {formatRelative(s.created_at)}
                    </TD>
                    <TD className="px-adm-4 py-adm-3 text-right">
                      <Button variant="ghost" size="sm" onClick={(ev) => {
                        ev.stopPropagation();
                        onOpenSession(s.session_id);
                      }}>
                        <ChevronRight className="size-3.5" aria-hidden />
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        )}
        <div className="flex flex-wrap items-center justify-between gap-adm-3 border-t border-adm-line pt-adm-4">
          <p className="text-[11px] text-adm-muted">
            Showing {Math.min(from + 1, sessions.length)} –{" "}
            {Math.min(from + sessions.length, sessions.length)} of {total.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-adm-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={onPrevPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={onNextPage}
            >
              Next
            </Button>
            <span className="text-[11px] text-adm-muted">
              Page {currentPage} of {pageCount}
            </span>
          </div>
        </div>
      </PanelBody>
    </>
  );
}

/** Message history view: visitor vs assistant bubbles, chronologically ordered. */
function MessageHistoryView({
  sessionId,
  messages,
  pageMessages,
  currentMsgPage,
  msgPageCount,
  onClose,
  onNextMsgPage,
  onPrevMsgPage,
  loading,
}: {
  sessionId: string;
  messages: Message[];
  pageMessages: Message[];
  currentMsgPage: number;
  msgPageCount: number;
  onClose: () => void;
  onNextMsgPage: () => void;
  onPrevMsgPage: () => void;
  loading: boolean;
}) {
  const msgFrom = (currentMsgPage - 1) * PAGE_SIZE;
  return (
    <>
      <PanelHeader
        title={`Conversation — ${sessionId}`}
        description={`${messages.length.toLocaleString("en-IN")} message exchanged`}
        icon={Clock}
        actions={
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to list
          </Button>
        }
      />
      <PanelBody className="space-y-adm-4">
        {messages.length === 0 ? (
          <EmptyState
            icon={Bot}
            title="No messages in this session"
            description="The transcript is empty or could not be loaded."
          />
        ) : (
          <div className="space-y-adm-4 max-h-[64vh] overflow-y-auto pr-adm-2">
            {pageMessages.map((m) => (
              <React.Fragment key={m.id}>
                {/* Visitor message */}
                <div className="flex flex-col md:flex-row md:items-start gap-adm-3">
                  <div className="shrink-0">
                    <User className="size-3.5 text-adm-muted" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="rounded-xl rounded-tr-md bg-adm-surface-2 border border-adm-line p-adm-3 text-adm-fg text-sm whitespace-pre-wrap break-words">
                      {m.user_message}
                    </div>
                    <p className="mt-1 text-[10px] text-adm-subtle text-right">
                      {formatRelative(m.created_at)}
                    </p>
                  </div>
                </div>
                {/* Assistant message */}
                <div className="flex flex-col md:flex-row md:flex-row-reverse md:items-start gap-adm-3">
                  <div className="flex-1">
                    <div className="rounded-xl rounded-tl-md bg-adm-accent/10 border border-adm-accent/20 p-adm-3 text-adm-fg text-sm whitespace-pre-wrap break-words">
                      {m.bot_reply}
                    </div>
                    <div className="mt-1 flex items-center gap-adm-2 text-[10px] text-adm-subtle">
                      {typeof m.latency_ms === "number" && (
                        <span>{m.latency_ms} ms</span>
                      )}
                      {typeof m.confidence === "number" && (
                        <>
                          <span>·</span>
                          <span>{(m.confidence * 100).toFixed(0)}% conf</span>
                        </>
                      )}
                      {m.intent && (
                        <>
                          <span>·</span>
                          <span className="font-medium">{m.intent}</span>
                        </>
                      )}
                      <span>{formatRelative(m.created_at)}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Bot className="size-3.5 text-adm-accent" aria-hidden />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </PanelBody>
      <PanelFooter className="block space-y-adm-2">
        <div className="flex flex-wrap items-center justify-between gap-adm-3 border-t border-adm-line pt-adm-4">
          <p className="text-[11px] text-adm-muted">
            Showing messages{" "}
            <span className="font-medium text-adm-fg">
              {Math.min(msgFrom + 1, messages.length)} –{" "}
              {Math.min(msgFrom + pageMessages.length, messages.length)}
            </span>{" "}
            of {messages.length.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-adm-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentMsgPage === 1}
              onClick={onPrevMsgPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentMsgPage >= msgPageCount}
              onClick={onNextMsgPage}
            >
              Next
            </Button>
            <span className="text-[11px] text-adm-muted">
              Page {currentMsgPage} of {msgPageCount}
            </span>
          </div>
        </div>
      </PanelFooter>
    </>
  );
}
