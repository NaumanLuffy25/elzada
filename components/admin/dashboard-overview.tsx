"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Database,
  Inbox,
  KeyRound,
  MessagesSquare,
  Phone,
  RefreshCw,
  Settings2,
  Sparkles,
} from "lucide-react";

import { cn, formatRelative } from "@/lib/utils";
import type { ConversationRow, EnquiryRow } from "@/lib/supabase";
import { adminNavHref } from "@/components/admin/nav-config";
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Field,
  Input,
  KpiCard,
  KpiGrid,
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  Skeleton,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  TableWrap,
} from "@/components/admin/ui";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Range = "24h" | "7d" | "30d";
const RANGES: Range[] = ["24h", "7d", "30d"];

type SystemCheck = {
  id: string;
  label: string;
  status: "ok" | "warn" | "down";
  detail: string;
};

/** Every field below is produced by `GET /api/admin` — nothing is invented client-side. */
type AdminSummary = {
  range: string;
  counts: { conversations: number; enquiries: number; knowledge: number };
  totals: {
    enquiries: number;
    conversations: number;
    knowledge: number;
    fetchedEnquiries: number;
    fetchedConversations: number;
    maxRows: number;
    distributionsComplete: boolean;
  };
  status: Record<string, number>;
  funnel: {
    total: number;
    fresh: number;
    contacted: number;
    resolved: number;
    spam: number;
    other: number;
  };
  programs: { name: string; count: number }[];
  enquiriesWithoutProgram: number;
  timeline: { date: string; conversations: number; enquiries: number }[];
  enquiries: EnquiryRow[];
  conversations: ConversationRow[];
  notes: {
    statuses: string[];
    contactedStatus: string;
    convertedStatus: string | null;
    caveat: string;
  };
  system: {
    checkedAt: string;
    dbMs: number;
    supabaseConfigured: boolean;
    checks: SystemCheck[];
  };
};

const TOKEN_KEY = "elzada_admin_token";

/** Inlined by Next.js — this is the only configuration the browser can see unaided. */
const SUPABASE_PUBLIC = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/* -------------------------------------------------------------------------- */
/* Palette                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Chart colours are read back out of `styles/admin.css` so the charts can never
 * drift from the shell. The literals are only the pre-hydration fallback and
 * mirror the token file exactly.
 */
const PALETTE_FALLBACK = {
  accent: "rgb(59 130 246)",
  muted: "rgb(147 161 184)",
  warn: "rgb(251 191 36)",
  ok: "rgb(52 211 153)",
  subtle: "rgb(100 116 139)",
  fg: "rgb(232 237 246)",
  surface: "rgb(27 38 61)",
  line: "rgba(148, 163, 184, 0.14)",
};

type Palette = typeof PALETTE_FALLBACK;

function useAdmPalette(): Palette {
  const [palette, setPalette] = useState<Palette>(PALETTE_FALLBACK);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".adm-shell");
    if (!el) return;
    const cs = getComputedStyle(el);
    const next: Palette = { ...PALETTE_FALLBACK };
    let changed = false;

    (Object.keys(PALETTE_FALLBACK) as (keyof Palette)[]).forEach((key) => {
      if (key === "line") return;
      const raw = cs.getPropertyValue(`--adm-ch-${key}`).trim();
      if (!raw) return;
      next[key] = raw.startsWith("#") || raw.includes("(") ? raw : `rgb(${raw})`;
      changed = true;
    });

    const line = cs.getPropertyValue("--adm-line").trim();
    if (line) {
      next.line = line;
      changed = true;
    }

    if (changed) setPalette(next);
  }, []);

  return palette;
}

/* -------------------------------------------------------------------------- */
/* Status vocabulary — mirrors `enquiries.status` in sql/schema.sql           */
/* -------------------------------------------------------------------------- */

type StatusKey = "new" | "in_progress" | "resolved" | "spam" | "other";

const STATUS_ORDER: StatusKey[] = ["new", "in_progress", "resolved", "spam", "other"];

const STATUS_META: Record<StatusKey, { label: string; tone: "accent" | "warning" | "success" | "neutral"; paletteKey: keyof Palette }> =
  {
    new: { label: "New", tone: "accent", paletteKey: "accent" },
    in_progress: { label: "In progress", tone: "warning", paletteKey: "warn" },
    resolved: { label: "Resolved", tone: "success", paletteKey: "ok" },
    spam: { label: "Spam", tone: "neutral", paletteKey: "subtle" },
    other: { label: "Other", tone: "neutral", paletteKey: "muted" },
  };

function statusKey(raw: string): StatusKey {
  return (STATUS_ORDER as string[]).includes(raw) ? (raw as StatusKey) : "other";
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function DashboardOverview() {
  const palette = useAdmPalette();

  const [token, setToken] = useState<string | null>(null); // null → still reading storage
  const [data, setData] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [range, setRange] = useState<Range>("7d");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [tokenFormOpen, setTokenFormOpen] = useState(false);
  const [tokenDraft, setTokenDraft] = useState("");
  const [tokenNotice, setTokenNotice] = useState<string | null>(null);

  const load = useCallback(async (currentToken: string | null, currentRange: Range) => {
    if (currentToken === null) return;
    setLoading(true);
    setError(null);
    const t0 = performance.now();
    try {
      const res = await fetch(`/api/admin?range=${currentRange}`, {
        headers: currentToken ? { "x-admin-token": currentToken } : {},
        cache: "no-store",
      });
      setHttpStatus(res.status);

      if (res.status === 401) {
        setData(null);
        setError(
          currentToken
            ? "The server rejected the stored token. Make sure ADMIN_DASHBOARD_TOKEN in .env.local matches the value entered here."
            : "No admin token entered yet. Set ADMIN_DASHBOARD_TOKEN in .env.local, then click “Set token” above to connect.",
        );
        return;
      }

      if (!res.ok) {
        setData(null);
        let message = `The admin API responded with HTTP ${res.status}.`;
        try {
          const body = (await res.json()) as { error?: string };
          if (body?.error) message = body.error;
        } catch {
          /* non-JSON body — keep the status message */
        }
        setError(message);
        return;
      }

      setData((await res.json()) as AdminSummary);
    } catch (cause: any) {
      setData(null);
      setError(cause?.message || "Could not reach /api/admin.");
    } finally {
      setLastUpdated(Date.now());
      setLoading(false);
    }
  }, []);

  // Read the stored token once, then fetch whenever the token or range changes.
  useEffect(() => {
    let stored = "";
    try {
      stored = window.localStorage.getItem(TOKEN_KEY) ?? "";
    } catch {
      stored = "";
    }
    setToken(stored);
  }, []);

  useEffect(() => {
    if (token === null) return;
    void load(token, range);
  }, [token, range, load]);

  const openTokenForm = useCallback(() => {
    setTokenDraft(token ?? "");
    setTokenNotice(null);
    setTokenFormOpen(true);
  }, [token]);

  const saveToken = useCallback(() => {
    const trimmed = tokenDraft.trim();
    try {
      if (trimmed) window.localStorage.setItem(TOKEN_KEY, trimmed);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage may be blocked — the in-memory token still applies */
    }
    setToken(trimmed);
    setTokenFormOpen(false);
    setTokenNotice(
      trimmed
        ? "Token saved. Reloading the dashboard so every panel reconnects to Supabase…"
        : "Token cleared. The dashboard is now disconnected.",
    );
    // Other panels read the token from storage on mount, so a reload is the
    // reliable way to bring all of them online at once.
    window.setTimeout(() => window.location.reload(), 900);
  }, [tokenDraft]);

  const clearToken = useCallback(() => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    setTokenDraft("");
    setToken("");
    setTokenFormOpen(false);
    setTokenNotice("Token cleared. The dashboard is now disconnected.");
  }, []);

  const refresh = useCallback(() => {
    if (token !== null) void load(token, range);
  }, [token, range, load]);

  /** Server-side checks when authorized; otherwise what this browser can observe. */
  const checks = useMemo<SystemCheck[]>(
    () => data?.system.checks ?? buildClientChecks({ token, httpStatus }),
    [data, token, httpStatus],
  );
  const checksFromServer = Boolean(data?.system.checks);
  const busy = loading && !data;

  /** Single source of truth for the connection indicator. */
  const connection: { tone: "neutral" | "info" | "success" | "warning" | "danger"; label: string } =
    loading && !data
      ? { tone: "info", label: "Connecting…" }
      : data
        ? { tone: "success", label: "Connected" }
        : httpStatus === 401
          ? { tone: token ? "warning" : "neutral", label: token ? "Token rejected" : "Not connected" }
          : error
            ? { tone: "danger", label: "Error" }
            : { tone: "neutral", label: "Not connected" };

  return (
    <div className="space-y-adm-6">
      <div className="flex flex-wrap items-end justify-between gap-adm-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-adm-fg">Overview</h2>
          <p className="mt-0.5 text-[12px] leading-relaxed text-adm-muted">
            Admission pipeline, chatbot volume and platform status — every figure below is read
            from the live tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-adm-2">
          <Badge tone={connection.tone} dot size="sm">
            {connection.label}
          </Badge>
          {lastUpdated ? (
            <span className="text-[11px] tabular-nums text-adm-subtle">
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          ) : null}
          <Button variant="outline" size="sm" onClick={openTokenForm} aria-expanded={tokenFormOpen}>
            <Settings2 className="size-3.5" aria-hidden />
            {token ? "Update token" : "Set token"}
          </Button>
          <Button variant="outline" size="sm" onClick={refresh} loading={loading}>
            <RefreshCw className={cn("size-3.5", loading && "opacity-0")} aria-hidden />
            Refresh
          </Button>
        </div>
      </div>

      {tokenNotice ? (
        <Alert tone="success" title="Token updated">
          {tokenNotice}
        </Alert>
      ) : null}

      {tokenFormOpen ? (
        <Panel>
          <PanelHeader
            title="Connect to live Supabase data"
            description="The dashboard reads the database through /api/admin using this token — the service-role key never leaves the server."
            icon={KeyRound}
          />
          <PanelBody className="space-y-adm-4">
            <ol className="space-y-adm-2 text-[12px] leading-relaxed text-adm-muted">
              <li>
                <span className="font-medium text-adm-fg">1.</span> Open{" "}
                <code className="font-mono text-adm-fg">.env.local</code> in the project root and copy the value of{" "}
                <code className="font-mono text-adm-fg">ADMIN_DASHBOARD_TOKEN</code>.
              </li>
              <li>
                <span className="font-medium text-adm-fg">2.</span> Paste it into the field below and click{" "}
                <span className="font-medium text-adm-fg">Save token</span>.
              </li>
              <li>
                <span className="font-medium text-adm-fg">3.</span> The dashboard reloads and reconnects every panel.
                A green <span className="font-medium text-adm-fg">Connected</span> badge confirms live data. Use{" "}
                <span className="font-medium text-adm-fg">Clear</span> to disconnect.
              </li>
            </ol>

            <Field
              label="ADMIN_DASHBOARD_TOKEN"
              htmlFor="admin-token-input"
              hint="Stored only in this browser's localStorage. Never sent anywhere except /api/admin."
            >
              <Input
                id="admin-token-input"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={tokenDraft}
                onChange={(e) => setTokenDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveToken();
                }}
                placeholder="Paste the token here"
              />
            </Field>

            <div className="flex flex-wrap gap-adm-2">
              <Button variant="primary" size="sm" onClick={saveToken}>
                <KeyRound className="size-3.5" aria-hidden />
                Save token
              </Button>
              <Button variant="ghost" size="sm" onClick={clearToken}>
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setTokenFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </PanelBody>
        </Panel>
      ) : null}

      <KpiRow
        data={data}
        loading={busy}
        error={error}
        range={range}
        hasToken={Boolean(token)}
        onRetry={refresh}
        onPromptToken={openTokenForm}
      />

      <div className="grid gap-adm-6 lg:grid-cols-12">
        <ActivityPanel
          className="lg:col-span-8"
          data={data}
          loading={busy}
          range={range}
          onRangeChange={setRange}
          palette={palette}
        />
        <StatusPanel className="lg:col-span-4" data={data} loading={busy} palette={palette} />
      </div>

      <div className="grid gap-adm-6 lg:grid-cols-12">
        <ProgramsPanel className="lg:col-span-4" data={data} loading={busy} />
        <RecentEnquiriesPanel className="lg:col-span-8" data={data} loading={busy} />
      </div>

      <SystemStatusPanel checks={checks} fromServer={checksFromServer} data={data} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* KPI row                                                                    */
/* -------------------------------------------------------------------------- */

function KpiRow({
  data,
  loading,
  error,
  range,
  hasToken,
  onRetry,
  onPromptToken,
}: {
  data: AdminSummary | null;
  loading: boolean;
  error: string | null;
  range: Range;
  hasToken: boolean;
  onRetry: () => void;
  onPromptToken: () => void;
}) {
  if (loading) {
    return (
      <KpiGrid className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[118px]" />
        ))}
      </KpiGrid>
    );
  }

  if (!data) {
    const rejected = hasToken && Boolean(error && /reject|not accepted|does not match/i.test(error));
    const missingToken = !hasToken && Boolean(error && /token/i.test(error));
    const title = missingToken
      ? "Not connected to Supabase yet"
      : rejected
        ? "Stored token was rejected"
        : "Overview data is unavailable";

    return (
      <div className="space-y-adm-3">
        <Alert tone={missingToken || rejected ? "warning" : "danger"} title={title}>
          {missingToken ? (
            <>
              No admin token is stored in this browser. Click <strong>Set token</strong> (top right){" "}
              or <strong>Set admin token</strong> below, then paste the value of{" "}
              <code className="font-mono">ADMIN_DASHBOARD_TOKEN</code> from{" "}
              <code className="font-mono">.env.local</code>. The token unlocks the server-side API that
              reads Supabase — the service-role key itself is never sent to the browser.
            </>
          ) : rejected ? (
            <>
              A token is stored in this browser, but the server rejected it. Open{" "}
              <code className="font-mono">.env.local</code>, copy the current{" "}
              <code className="font-mono">ADMIN_DASHBOARD_TOKEN</code>, then click <strong>Update token</strong>{" "}
              above and paste it.
            </>
          ) : (
            error ?? "The admin API returned no data."
          )}
        </Alert>
        <div className="flex flex-wrap gap-adm-2">
          <Button
            variant="primary"
            size="sm"
            onClick={missingToken || rejected ? onPromptToken : onRetry}
          >
            {missingToken ? (
              <Settings2 className="size-3.5" aria-hidden />
            ) : rejected ? (
              <Settings2 className="size-3.5" aria-hidden />
            ) : (
              <RefreshCw className="size-3.5" aria-hidden />
            )}
            {missingToken ? "Set admin token" : rejected ? "Update token" : "Try again"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onRetry}>
            <RefreshCw className="size-3.5" aria-hidden />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const { totals, funnel, counts } = data;
  const latest = data.enquiries[0];
  const share = totals.enquiries > 0 ? Math.round((funnel.fresh / totals.enquiries) * 100) : null;

  return (
    <KpiGrid className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <KpiCard
        label="Total enquiries"
        value={totals.enquiries.toLocaleString("en-IN")}
        hint={latest?.created_at ? `Latest ${formatRelative(latest.created_at)}` : "All time"}
        icon={Inbox}
        tone="accent"
      />
      <KpiCard
        label="New"
        value={funnel.fresh.toLocaleString("en-IN")}
        hint={share === null ? "No enquiries yet" : `${share}% of all enquiries`}
        icon={Sparkles}
        tone="accent"
      />
      <KpiCard
        label="Contacted"
        value={funnel.contacted.toLocaleString("en-IN")}
        hint="Marked in progress"
        icon={Phone}
        tone="info"
      />
      <KpiCard
        label="Resolved"
        value={funnel.resolved.toLocaleString("en-IN")}
        hint="Terminal state"
        icon={CheckCircle2}
        tone="success"
      />
      {/*
        Spans the remaining columns below xl so a 5-card strip never leaves an
        orphan cell in the last row; back to a single cell once xl lays 5 across.
      */}
      <KpiCard
        className="sm:col-span-2 xl:col-span-1"
        label="Chatbot conversations"
        value={totals.conversations.toLocaleString("en-IN")}
        hint={`${counts.conversations.toLocaleString("en-IN")} in last ${range}`}
        icon={MessagesSquare}
        tone="neutral"
      />
    </KpiGrid>
  );
}

/* -------------------------------------------------------------------------- */
/* Activity over time                                                         */
/* -------------------------------------------------------------------------- */

function ActivityPanel({
  className,
  data,
  loading,
  range,
  onRangeChange,
  palette,
}: {
  className?: string;
  data: AdminSummary | null;
  loading: boolean;
  range: Range;
  onRangeChange: (r: Range) => void;
  palette: Palette;
}) {
  const rows = useMemo(
    () =>
      (data?.timeline ?? []).map((d) => ({
        ...d,
        label: new Date(`${d.date}T00:00:00Z`).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
      })),
    [data],
  );

  const hasActivity = rows.some((r) => r.conversations > 0 || r.enquiries > 0);
  const totalEnquiries = rows.reduce((sum, r) => sum + r.enquiries, 0);
  const totalConversations = rows.reduce((sum, r) => sum + r.conversations, 0);

  return (
    <Panel className={className}>
      <PanelHeader
        title="Enquiry activity over time"
        description={`Daily volume across the last ${range}`}
        icon={Activity}
        actions={
          <div className="inline-flex rounded-adm-sm border border-adm-line bg-adm-bg-soft p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={range === r}
                onClick={() => onRangeChange(r)}
                className={cn(
                  "rounded-[4px] px-2 py-1 text-[11px] font-medium transition-colors duration-adm ease-adm",
                  range === r
                    ? "bg-adm-surface-3 text-adm-fg"
                    : "text-adm-muted hover:text-adm-fg",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <PanelBody>
        {loading ? (
          <Skeleton className="h-56" />
        ) : !hasActivity ? (
          <EmptyState
            icon={Activity}
            title={data ? "No activity in this window" : "No activity to show yet"}
            description={
              data
                ? data.system.supabaseConfigured
                  ? "No enquiries or conversations were recorded in the selected period. Try a longer range."
                  : "Supabase is not configured, so the enquiry and conversation tables are empty."
                : "Load the admin data above to plot daily enquiry and conversation volume."
            }
          />
        ) : (
          <div
            className="h-56"
            role="img"
            aria-label={`Daily volume for the last ${range}: ${totalEnquiries} enquiries and ${totalConversations} chatbot conversations.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.12)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: palette.subtle, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: palette.line }}
                  interval="preserveStartEnd"
                  minTickGap={18}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: palette.subtle, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148,163,184,0.08)" }}
                  contentStyle={{
                    background: palette.surface,
                    border: `1px solid ${palette.line}`,
                    borderRadius: 8,
                    fontSize: 12,
                    color: palette.fg,
                  }}
                  labelStyle={{ color: palette.muted }}
                  itemStyle={{ color: palette.fg }}
                />
                <Bar
                  dataKey="enquiries"
                  name="Enquiries"
                  fill={palette.accent}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
                <Bar
                  dataKey="conversations"
                  name="Conversations"
                  fill={palette.muted}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </PanelBody>

      <PanelFooter>
        <div className="flex flex-wrap items-center gap-adm-4 text-[11px] text-adm-muted">
          <span className="inline-flex items-center gap-adm-2">
            <span
              className="size-2 rounded-full"
              style={{ background: palette.accent }}
              aria-hidden
            />
            Enquiries {totalEnquiries.toLocaleString("en-IN")}
          </span>
          <span className="inline-flex items-center gap-adm-2">
            <span
              className="size-2 rounded-full"
              style={{ background: palette.muted }}
              aria-hidden
            />
            Conversations {totalConversations.toLocaleString("en-IN")}
          </span>
        </div>
        <SectionLink href={adminNavHref("analytics")} label="Open analytics" />
      </PanelFooter>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Enquiry status distribution                                                */
/* -------------------------------------------------------------------------- */

function StatusPanel({
  className,
  data,
  loading,
  palette,
}: {
  className?: string;
  data: AdminSummary | null;
  loading: boolean;
  palette: Palette;
}) {
  const counts = data?.status ?? null;
  const total = counts ? STATUS_ORDER.reduce((sum, key) => sum + (counts[key] ?? 0), 0) : 0;

  const segments = STATUS_ORDER.map((key) => {
    const value = counts?.[key] ?? 0;
    return {
      key,
      label: STATUS_META[key].label,
      value,
      pct: total > 0 ? (value / total) * 100 : 0,
      color: palette[STATUS_META[key].paletteKey],
    };
  }).filter((s) => s.value > 0);

  const incomplete = Boolean(data && !data.totals.distributionsComplete);

  return (
    <Panel className={className}>
      <PanelHeader
        title="Enquiry status distribution"
        description="Current state of every enquiry"
        icon={Inbox}
        actions={
          <Badge tone={total > 0 ? "accent" : "neutral"} size="sm">
            {total.toLocaleString("en-IN")}
          </Badge>
        }
      />

      <PanelBody className="space-y-adm-4">
        {loading ? (
          <Skeleton className="h-56" />
        ) : total === 0 ? (
          <EmptyState
            icon={Inbox}
            title={data ? "No enquiries yet" : "Distribution unavailable"}
            description={
              data
                ? data.system.supabaseConfigured
                  ? "The enquiries table has no rows. Submissions to the public enquiry form will appear here."
                  : "Supabase is not configured, so no enquiry rows exist. Copy .env.example to .env.local and run the SQL in /sql on a Supabase project."
                : "Load the admin data above to see how enquiries split by status."
            }
          />
        ) : (
          <>
            {/* Single proportion bar — the whole pipeline at a glance. */}
            <div
              className="flex h-2 w-full overflow-hidden rounded-full bg-adm-surface-2"
              role="img"
              aria-label={segments.map((s) => `${s.label} ${s.value} of ${total}`).join(", ")}
            >
              {segments.map((s) => (
                <span
                  key={s.key}
                  className="h-full"
                  style={{ width: `${s.pct}%`, background: s.color }}
                />
              ))}
            </div>

            <ul className="space-y-adm-2">
              {segments.map((s) => (
                <li key={s.key} className="flex items-center gap-adm-3">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: s.color }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-[12px] text-adm-muted">
                    {s.label}
                  </span>
                  <span className="text-[12px] font-medium tabular-nums text-adm-fg">
                    {s.value.toLocaleString("en-IN")}
                  </span>
                  <span className="w-10 text-right text-[11px] tabular-nums text-adm-subtle">
                    {Math.round(s.pct)}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </PanelBody>

      <PanelFooter className="block space-y-adm-2">
        <p className="text-[11px] leading-relaxed text-adm-subtle">
          Statuses come from <code className="font-mono">sql/schema.sql</code> — there is no{" "}
          <code className="font-mono">contacted</code> or{" "}
          <code className="font-mono">converted</code> value. In progress counts as contacted and
          resolved is the terminal state; a real conversion flag needs a schema change, which this
          phase does not make.
        </p>
        {incomplete ? (
          <p className="text-[11px] leading-relaxed text-adm-subtle">
            Computed over the most recent{" "}
            {data!.totals.fetchedEnquiries.toLocaleString("en-IN")} of{" "}
            {data!.totals.enquiries.toLocaleString("en-IN")} enquiries.
          </p>
        ) : null}
        <SectionLink href={adminNavHref("enquiries")} label="Open enquiries" />
      </PanelFooter>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Most requested programs                                                    */
/* -------------------------------------------------------------------------- */

function ProgramsPanel({
  className,
  data,
  loading,
}: {
  className?: string;
  data: AdminSummary | null;
  loading: boolean;
}) {
  const programs = data?.programs ?? [];
  const max = programs.reduce((m, p) => Math.max(m, p.count), 0);
  const withProgram = data ? data.totals.fetchedEnquiries - data.enquiriesWithoutProgram : 0;

  return (
    <Panel className={className}>
      <PanelHeader
        title="Most requested programs"
        description="Programmes applicants ask for most"
        icon={MessagesSquare}
      />

      <PanelBody className="space-y-adm-3">
        {loading ? (
          <Skeleton className="h-56" />
        ) : programs.length === 0 ? (
          <EmptyState
            title={data ? "No programme preferences yet" : "Programme data unavailable"}
            description={
              data
                ? data.system.supabaseConfigured
                  ? "Programme counts come from the enquiry form's programme field, which is still empty."
                  : "Supabase is not configured, so there are no enquiry rows to summarise."
                : "Load the admin data above to see which programmes are requested most."
            }
          />
        ) : (
          <ul className="space-y-adm-3">
            {programs.map((p) => (
              <li key={p.name} className="space-y-1">
                <div className="flex items-baseline justify-between gap-adm-3">
                  <span className="min-w-0 truncate text-[12px] text-adm-fg">{p.name}</span>
                  <span className="shrink-0 text-[12px] font-medium tabular-nums text-adm-muted">
                    {p.count.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-adm-surface-2">
                  <span
                    className="block h-full rounded-full bg-adm-accent"
                    style={{ width: `${max > 0 ? (p.count / max) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelBody>

      <PanelFooter className="block space-y-adm-1">
        <p className="text-[11px] text-adm-subtle">
          {withProgram > 0
            ? `${withProgram.toLocaleString("en-IN")} enquiries included a programme.`
            : "No programme data yet."}
          {data && data.enquiriesWithoutProgram > 0
            ? ` ${data.enquiriesWithoutProgram.toLocaleString("en-IN")} had none selected.`
            : ""}
        </p>
        <SectionLink href={adminNavHref("enquiries")} label="Open enquiries" />
      </PanelFooter>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent admission enquiries                                                 */
/* -------------------------------------------------------------------------- */

function RecentEnquiriesPanel({
  className,
  data,
  loading,
}: {
  className?: string;
  data: AdminSummary | null;
  loading: boolean;
}) {
  const rows = (data?.enquiries ?? []).slice(0, 6);

  return (
    <Panel className={className}>
      <PanelHeader
        title="Recent admission enquiries"
        description="Newest submissions first"
        icon={Inbox}
        actions={
          data ? (
            <Badge tone="neutral" size="sm">
              {rows.length} of {data.totals.enquiries.toLocaleString("en-IN")}
            </Badge>
          ) : null
        }
      />

      {loading ? (
        <PanelBody className="space-y-adm-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9" />
          ))}
        </PanelBody>
      ) : rows.length === 0 ? (
        <PanelBody>
          <EmptyState
            icon={Inbox}
            title={data ? "No enquiries yet" : "Enquiries not loaded"}
            description={
              data
                ? data.system.supabaseConfigured
                  ? "Nothing has been submitted through the public enquiry form."
                  : "Supabase is not configured, so no enquiry rows exist. Copy .env.example to .env.local and run the SQL in /sql on a Supabase project."
                : "Live rows appear once the admin API accepts a token."
            }
          />
        </PanelBody>
      ) : (
        <PanelBody className="p-0 sm:p-0">
          <TableWrap className="border-0 bg-transparent">
            <Table>
              <THead>
                <TR>
                  <TH>Applicant</TH>
                  <TH className="hidden sm:table-cell">Programme</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Received</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((e) => {
                  const meta = STATUS_META[statusKey(String(e.status ?? "new"))];
                  return (
                    <TR key={e.id}>
                      <TD>
                        <span className="block truncate font-medium text-adm-fg">{e.name}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-adm-subtle">
                          {e.email}
                        </span>
                      </TD>
                      <TD className="hidden sm:table-cell">
                        <span className="text-[12px] text-adm-muted">
                          {e.program?.trim() ? e.program : "—"}
                        </span>
                      </TD>
                      <TD>
                        <Badge tone={meta.tone} size="sm">
                          {meta.label}
                        </Badge>
                      </TD>
                      <TD className="whitespace-nowrap text-right text-[12px] text-adm-subtle">
                        {formatRelative(e.created_at)}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrap>
        </PanelBody>
      )}

      <PanelFooter>
        <span className="text-[11px] text-adm-subtle">
          {data
            ? `Showing ${Math.min(6, rows.length)} of ${data.totals.enquiries.toLocaleString("en-IN")} enquiries`
            : "Live rows require a valid admin token"}
        </span>
        <SectionLink href={adminNavHref("enquiries")} label="Open inbox" />
      </PanelFooter>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* System status                                                              */
/* -------------------------------------------------------------------------- */

const CHECK_TONE = {
  ok: { dot: "bg-adm-ok", badge: "success" as const, label: "OK" },
  warn: { dot: "bg-adm-warn", badge: "warning" as const, label: "Check" },
  down: { dot: "bg-adm-danger", badge: "danger" as const, label: "Issue" },
};

function SystemStatusPanel({
  checks,
  fromServer,
  data,
}: {
  checks: SystemCheck[];
  fromServer: boolean;
  data: AdminSummary | null;
}) {
  const issues = checks.filter((c) => c.status !== "ok").length;

  return (
    <Panel>
      <PanelHeader
        title="System status"
        description={
          fromServer && data
            ? `Server-side checks run at ${new Date(data.system.checkedAt).toLocaleTimeString()} · ${data.system.dbMs}ms`
            : "Observed from this browser — server-side table checks appear once the request is authorized"
        }
        icon={Database}
        actions={
          <Badge tone={issues === 0 ? "success" : "warning"} size="sm" dot>
            {issues === 0 ? "All good" : `${issues} need attention`}
          </Badge>
        }
      />

      <PanelBody className="p-0 sm:p-0">
        <ul className="divide-y divide-adm-line">
          {checks.map((c) => {
            const tone = CHECK_TONE[c.status];
            return (
              <li key={c.id} className="flex items-start gap-adm-3 px-adm-5 py-adm-3">
                <span
                  className={cn("mt-1.5 size-2 shrink-0 rounded-full", tone.dot)}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-adm-2">
                    <span className="text-[12px] font-medium text-adm-fg">{c.label}</span>
                    <Badge tone={tone.badge} size="sm">
                      {tone.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 break-words text-[11px] leading-relaxed text-adm-muted">
                    {c.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </PanelBody>

      <PanelFooter className="block space-y-adm-2">
        {!fromServer ? (
          <p className="text-[11px] leading-relaxed text-adm-subtle">
            Database reachability, table row counts, the bundled RAG dataset and provider keys are
            reported by <code className="font-mono">GET /api/admin</code> and cannot be inspected
            until that endpoint accepts a token.
          </p>
        ) : null}
        <SectionLink href={adminNavHref("system-health")} label="Open system health" />
      </PanelFooter>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
/* -------------------------------------------------------------------------- */

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[11px] font-medium text-adm-accent transition-colors duration-adm ease-adm hover:text-adm-accent-hover"
    >
      {label}
      <ArrowRight className="size-3" aria-hidden />
    </Link>
  );
}

/**
 * Checks the browser can make without the admin token: the public Supabase
 * config is inlined into the client bundle, and the API response itself is the
 * auth probe. Deeper checks come back from `GET /api/admin`.
 */
function buildClientChecks({
  token,
  httpStatus,
}: {
  token: string | null;
  httpStatus: number | null;
}): SystemCheck[] {
  const apiStatus: SystemCheck["status"] =
    httpStatus === null ? "warn" : httpStatus === 200 ? "ok" : "down";

  const apiDetail =
    httpStatus === null
      ? "Not contacted yet."
      : httpStatus === 200
        ? "Responded 200 — request authorized."
        : `Responded ${httpStatus} — ${
            httpStatus === 401
              ? token
                ? "the stored token does not match ADMIN_DASHBOARD_TOKEN on the server"
                : "no token was sent"
              : "unexpected server response"
          }.`;

  return [
    { id: "admin-api", label: "Admin API", status: apiStatus, detail: apiDetail },
    {
      id: "admin-token",
      label: "Admin token",
      status: token ? "ok" : "down",
      detail: token
        ? "Present in this browser's local storage."
        : "None stored — the dashboard cannot authorize any request.",
    },
    {
      id: "database",
      label: "Supabase",
      status: SUPABASE_PUBLIC ? "warn" : "down",
      detail: SUPABASE_PUBLIC
        ? "NEXT_PUBLIC_SUPABASE_URL is set. Run an authorized request to verify the service key and tables."
        : "Not configured — NEXT_PUBLIC_SUPABASE_URL is unset. Copy .env.example to .env.local, then run sql/pgvector-setup.sql and sql/schema.sql against a Supabase project. This app never creates tables itself.",
    },
  ];
}
