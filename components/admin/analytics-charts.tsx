"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Summary = {
  range: string;
  counts: { conversations: number; enquiries: number; knowledge: number };
  intents: Record<string, number>;
  categories: Record<string, number>;
  timeline: { date: string; conversations: number; enquiries: number }[];
};

const PIE_COLOURS = ["#36adf8", "#7cc8fc", "#bae0fd", "#0c93e9", "#0074c7", "#015da1", "#0b426e", "#64d2a3", "#a78bfa", "#f97316"];

const MOCK_TIMELINE = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toLocaleDateString("en-IN", { weekday: "short" }),
    conversations: 20 + Math.round(Math.random() * 40),
    enquiries: 5 + Math.round(Math.random() * 8),
  };
});

const MOCK_INTENTS = [
  { name: "admission", value: 38 },
  { name: "fees", value: 22 },
  { name: "placement", value: 19 },
  { name: "program", value: 12 },
  { name: "facility", value: 7 },
  { name: "contact", value: 5 },
  { name: "scholarship", value: 4 },
  { name: "campus", value: 3 },
];

export function AnalyticsCharts() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("elzada_admin_token") : "";
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/admin?range=7d", { headers: { "x-admin-token": token } });
        if (res.ok) {
          const json = await res.json();
          setSummary(json);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const timeline = summary?.timeline?.length
    ? summary.timeline.map((t) => ({ date: new Date(t.date).toLocaleDateString("en-IN", { weekday: "short" }), conversations: t.conversations, enquiries: t.enquiries }))
    : MOCK_TIMELINE;
  const intents = summary?.intents
    ? Object.entries(summary.intents).map(([name, value]) => ({ name, value }))
    : MOCK_INTENTS;

  return (
    <section className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Conversations vs Enquiries (last 7 days)</h3>
          <span className="text-[11px] text-white/40">Daily</span>
        </header>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#36adf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#36adf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gEnq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64d2a3" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#64d2a3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "white" }}
              />
              <Area type="monotone" dataKey="conversations" stroke="#36adf8" fill="url(#gConv)" />
              <Area type="monotone" dataKey="enquiries" stroke="#64d2a3" fill="url(#gEnq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Intent distribution</h3>
          <span className="text-[11px] text-white/40">%</span>
        </header>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={intents} dataKey="value" nameKey="name" innerRadius={48} outerRadius={88} paddingAngle={2}>
                {intents.map((_, i) => (
                  <Cell key={i} fill={PIE_COLOURS[i % PIE_COLOURS.length]} stroke="rgba(0,0,0,0.2)" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "white" }}
              />
              <Legend wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Top question categories</h3>
          <span className="text-[11px] text-white/40">Last 7 days</span>
        </header>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={intents.slice(0, 8)} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "white" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {intents.slice(0, 8).map((_, i) => (
                  <Cell key={i} fill={PIE_COLOURS[i % PIE_COLOURS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
