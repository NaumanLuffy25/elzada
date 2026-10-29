"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Info, Loader2, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  Skeleton,
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";

type RagMetrics = {
  total: number;
  answered: number;
  refusalRate: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  avgConfidence: number;
  top1Accuracy: number;
  exactAnswerRate: number;
  perCategory: Record<string, { count: number; top1: number }>;
  perIntent: Record<string, { count: number; top1: number }>;
};

type EvaluationResponse = {
  rag: RagMetrics;
  generatedAt: string;
};

const TOKEN_KEY = "elzada_admin_token";

function formatRelative(iso: string | null): string {
  if (!iso) return "never";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function RagMonitoring() {
  const [metrics, setMetrics] = useState<RagMetrics | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;

  const fetchMetrics = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/evaluation", {
        headers: { "x-admin-token": t },
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("Admin token not accepted. Set ADMIN_DASHBOARD_TOKEN in .env.local.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as EvaluationResponse;
      setMetrics(json.rag);
      setGeneratedAt(json.generatedAt);
    } catch (cause: any) {
      setError(cause?.message || "Could not load RAG metrics.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMetrics(token);
  }, [token, fetchMetrics]);

  const handleRefresh = useCallback(() => {
    if (token) void fetchMetrics(token);
  }, [token, fetchMetrics]);

  if (loading) {
    return (
      <Panel>
        <PanelHeader title="RAG Pipeline Health" description="Retrieval quality and latency — separate from the intent classifier." icon={Activity} />
        <PanelBody className="flex items-center justify-center py-adm-16">
          <LoadingState label="Loading metrics…" />
        </PanelBody>
      </Panel>
    );
  }

  if (!token) {
    return (
      <Panel>
        <PanelHeader title="RAG Pipeline Health" description="Retrieval quality and latency — separate from the intent classifier." icon={Activity} />
        <PanelBody className="py-adm-10">
          <Alert tone="info" title="Admin token required">
            Set ADMIN_DASHBOARD_TOKEN in .env.local and paste it via the &quot;Set token&quot; action on the Overview to load
            live RAG metrics.
          </Alert>
        </PanelBody>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel>
        <PanelHeader title="RAG Pipeline Health" description="Retrieval quality and latency — separate from the intent classifier." icon={Activity} />
        <PanelBody>
          <ErrorState title="RAG metrics unavailable" description={error} onRetry={handleRefresh} retryLabel="Try again" />
        </PanelBody>
      </Panel>
    );
  }

  if (!metrics) {
    return (
      <Panel>
        <PanelHeader title="RAG Pipeline Health" description="Retrieval quality and latency — separate from the intent classifier." icon={Activity} />
        <PanelBody>
          <EmptyState icon={Info} title="No metrics available" description="Run the evaluation pipeline to generate RAG metrics." />
        </PanelBody>
      </Panel>
    );
  }

  const perCategoryEntries = Object.entries(metrics.perCategory).sort((a, b) => b[1].count - a[1].count);
  const perIntentEntries = Object.entries(metrics.perIntent).sort((a, b) => b[1].count - a[1].count);

  const headerDesc = generatedAt
    ? "Retrieval quality and latency — separate from the intent classifier. Generated " +
      formatRelative(generatedAt) +
      "."
    : "Retrieval quality and latency — separate from the intent classifier.";

  return (
    <Panel>
      <PanelHeader
        title="RAG Pipeline Health"
        description={headerDesc}
        icon={Activity}
        actions={
          <Button variant="outline" size="sm" onClick={handleRefresh} loading={loading}>
            <RefreshCw className="size-3.5" aria-hidden />
            Refresh
          </Button>
        }
      />
      <PanelBody className="space-y-adm-6">
        {/* KPI cards */}
        <div className="grid gap-adm-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total evaluations" value={metrics.total.toLocaleString("en-IN")} tone="neutral" />
          <MetricCard label="Answered" value={metrics.answered.toLocaleString("en-IN")} tone="accent" />
          <MetricCard label="Refusal rate" value={`${(metrics.refusalRate * 100).toFixed(1)}%`} tone="warning" />
          <MetricCard label="Top-1 accuracy" value={`${(metrics.top1Accuracy * 100).toFixed(1)}%`} tone="success" />
        </div>

        <div className="grid gap-adm-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Exact answer rate" value={`${(metrics.exactAnswerRate * 100).toFixed(1)}%`} tone="success" />
          <MetricCard label="Avg confidence" value={`${(metrics.avgConfidence * 100).toFixed(1)}%`} tone="info" />
          <MetricCard label="p50 latency" value={`${metrics.p50LatencyMs}ms`} tone="neutral" />
          <MetricCard label="p95 latency" value={`${metrics.p95LatencyMs}ms`} tone="neutral" />
        </div>

        {/* Per-category breakdown */}
        <div className="space-y-adm-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-semibold text-adm-fg uppercase tracking-[0.12em]">Accuracy by category</h4>
            <Badge tone="neutral" size="sm">{perCategoryEntries.length} categories</Badge>
          </div>
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Category</TH>
                  <TH className="text-center">Count</TH>
                  <TH className="text-center">Top-1 accuracy</TH>
                </TR>
              </THead>
              <TBody>
                {perCategoryEntries.map(([cat, m]) => (
                  <TR key={cat}>
                    <TD className="px-adm-4 py-adm-3 text-adm-fg">{cat}</TD>
                    <TD className="px-adm-4 py-adm-3 text-center text-adm-muted">{m.count}</TD>
                    <TD className="px-adm-4 py-adm-3 text-center text-adm-fg">
                      {m.count > 0 ? `${((m.top1 / m.count) * 100).toFixed(1)}%` : "—"}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        </div>

        {/* Per-intent breakdown */}
        <div className="space-y-adm-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-semibold text-adm-fg uppercase tracking-[0.12em]">Accuracy by intent</h4>
            <Badge tone="neutral" size="sm">{perIntentEntries.length} intents</Badge>
          </div>
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Intent</TH>
                  <TH className="text-center">Count</TH>
                  <TH className="text-center">Top-1 accuracy</TH>
                </TR>
              </THead>
              <TBody>
                {perIntentEntries.map(([intent, m]) => (
                  <TR key={intent}>
                    <TD className="px-adm-4 py-adm-3 text-adm-fg">{intent}</TD>
                    <TD className="px-adm-4 py-adm-3 text-center text-adm-muted">{m.count}</TD>
                    <TD className="px-adm-4 py-adm-3 text-center text-adm-fg">
                      {m.count > 0 ? `${((m.top1 / m.count) * 100).toFixed(1)}%` : "—"}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        </div>

        {/* Data source note */}
        <p className="text-[11px] leading-relaxed text-adm-subtle">
          Computed from the shared RAG evaluation fixtures in{" "}
          <code className="font-mono">lib/eval-fixtures.ts</code> — these are retrieval
          metrics, not live traffic and not the intent classifier.
        </p>
      </PanelBody>
      <PanelFooter className="flex justify-between items-center gap-adm-3">
        <span className="text-[11px] text-adm-subtle">
          {generatedAt ? "Last evaluated: " + formatRelative(generatedAt) : "—"}
        </span>
      </PanelFooter>
    </Panel>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "accent" | "success" | "warning" | "info" | "danger";
}) {
  const TONE_CLASS: Record<string, string> = {
    neutral: "text-adm-fg",
    accent: "text-adm-accent",
    success: "text-adm-ok",
    warning: "text-adm-warn",
    info: "text-adm-info",
    danger: "text-adm-danger",
  };
  return (
    <div className="rounded-adm border border-adm-line bg-adm-surface p-adm-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-adm-muted">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}
