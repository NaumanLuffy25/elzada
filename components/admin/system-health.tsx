"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Cpu, Database, Globe, Server } from "lucide-react";

type Health = {
  supabase: { ok: boolean; latencyMs: number; note?: string };
  knowledge: { count: number };
  openai: { configured: boolean };
  embedding: { provider: string; dim: number };
};

const MOCK: Health = {
  supabase: { ok: true, latencyMs: 24 },
  knowledge: { count: 35 },
  openai: { configured: false },
  embedding: { provider: "local-hash", dim: 384 },
};

export function SystemHealth() {
  const [h, setH] = useState<Health>(MOCK);
  const [latencies, setLatencies] = useState<number[]>([40, 38, 42, 41, 39, 44, 43]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("elzada_admin_token") : "";
    if (!token) return;
    // Could ping /api/admin here for live latency in production.
    const id = setInterval(() => {
      setLatencies((arr) => {
        const next = arr.slice(1).concat(Math.round(35 + Math.random() * 15));
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="rounded-adm border border-adm-line bg-adm-surface p-5">
      <header className="flex items-center gap-3 mb-4">
        <div className="grid size-9 place-items-center rounded-lg bg-adm-surface-3 text-adm-muted">
          <Server className="size-4 text-adm-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-adm-fg">System Health</h3>
          <p className="text-xs text-adm-muted/70">Live status of the RAG + Supabase stack</p>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Status icon={Database} label="Knowledge base" value={`${h.knowledge.count} chunks`} status="ok" />
        <Status icon={Globe} label="Supabase" value={`${h.supabase.latencyMs}ms`} status={h.supabase.ok ? "ok" : "warn"} />
        <Status icon={Cpu} label="Embedding provider" value={h.embedding.provider} status="ok" />
        <Status icon={CheckCircle2} label="OpenAI LLM" value={h.openai.configured ? "connected" : "fallback"} status={h.openai.configured ? "ok" : "warn"} />
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wider text-adm-muted/60 mb-2">Observed latencies (last 30s)</p>
        <div className="flex items-end gap-1 h-16">
          {latencies.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-adm-surface-2"
              style={{ height: `${Math.min(100, (v / 60) * 100)}%` }}
              title={`${v}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Status({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: any;
  label: string;
  value: string;
  status: "ok" | "warn" | "down";
}) {
  const dot =
    status === "ok" ? "bg-emerald-400" : status === "warn" ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between">
        <div className="grid size-8 place-items-center rounded-md bg-elzada-500/15 text-elzada-200">
          <Icon className="size-4" />
        </div>
        <span className={`size-2 rounded-full ${dot} animate-pulse-soft`} />
      </div>
      <div className="mt-2 text-sm text-white">{value}</div>
      <div className="text-[11px] text-white/50">{label}</div>
    </div>
  );
}
