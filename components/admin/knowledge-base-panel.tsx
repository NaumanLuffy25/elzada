"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Database, Loader2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn, formatRelative } from "@/lib/utils";
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
  Textarea,
} from "@/components/admin/ui";

type KbDoc = {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  metadata?: Record<string, unknown>;
};

const TOKEN_KEY = "elzada_admin_token";

export function KnowledgeBasePanel() {
  const [docs, setDocs] = useState<KbDoc[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ id: "", title: "", category: "", content: "", keywords: "" });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;

  const fetchDocs = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/knowledge-base?limit=100", {
        headers: { "x-admin-token": t },
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("Admin token not accepted. Set ADMIN_DASHBOARD_TOKEN in .env.local.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const fetched = (json.docs || []) as Array<{ category: string }>;
      setDocs(fetched as KbDoc[]);
      setCategories([...new Set(fetched.map((d) => d.category))].sort());
    } catch (cause: any) {
      setError(cause?.message || "Could not load knowledge base.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load docs from API or local JSON fallback
  useEffect(() => {
    if (token) {
      fetchDocs(token);
    } else {
      import("@/data/Elzada_Institute_of_Technology_RAG_Knowledge_Base.json").then((mod) => {
        const localDocs = mod.default as KbDoc[];
        setDocs(localDocs);
        setCategories([...new Set(localDocs.map((d) => d.category))].sort());
        setLoading(false);
      });
    }
  }, [token, fetchDocs]);

  const filteredDocs = useMemo(() => {
    const qLower = q.toLowerCase();
    return docs.filter((d) => {
      const matchQ =
        !qLower ||
        d.title.toLowerCase().includes(qLower) ||
        d.content.toLowerCase().includes(qLower) ||
        d.keywords.join(" ").toLowerCase().includes(qLower);
      const matchCat = categoryFilter === "all" || d.category === categoryFilter;
      return matchQ && matchCat;
    });
  }, [docs, q, categoryFilter]);

  const handleRefresh = useCallback(() => {
    if (token) void fetchDocs(token);
  }, [token, fetchDocs]);

  const handleAdd = useCallback(async () => {
    if (!draft.id || !draft.title || !draft.category || !draft.content) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setUpdatingId("add");
    try {
      if (token) {
        const res = await fetch("/api/knowledge-base", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-token": token },
          body: JSON.stringify({
            id: draft.id,
            title: draft.title,
            category: draft.category,
            content: draft.content,
            keywords: draft.keywords.split(",").map((s) => s.trim()).filter(Boolean),
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        toast.success("Knowledge chunk added.");
      }
      setDocs((d) => [
        ...d,
        { ...draft, keywords: draft.keywords.split(",").map((s) => s.trim()).filter(Boolean) },
      ]);
      setDraft({ id: "", title: "", category: "", content: "", keywords: "" });
      setCreating(false);
    } catch (cause: any) {
      toast.error(cause?.message || "Failed to add chunk.");
    } finally {
      setUpdatingId(null);
    }
  }, [draft, token]);

  const handleRemove = useCallback(async (id: string) => {
    if (!confirm("Delete this knowledge chunk?")) return;
    setUpdatingId(id);
    try {
      if (token) {
        await fetch(`/api/knowledge-base?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { "x-admin-token": token },
        });
      }
      setDocs((d) => d.filter((x) => x.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success("Knowledge chunk deleted.");
    } catch (cause: any) {
      toast.error(cause?.message || "Failed to delete chunk.");
    } finally {
      setUpdatingId(null);
    }
  }, [token, expandedId]);

  const expandedDoc = docs.find((d) => d.id === expandedId);

  return (
    <Panel>
      <PanelHeader
        title="Knowledge Base"
        description="RAG corpus chunks used by Elzada AI. View, search, and manage knowledge base entries."
        icon={Database}
        actions={
          <div className="flex flex-wrap items-center gap-adm-3">
            <SearchInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, content, keywords…"
              className="w-[260px] sm:w-[320px]"
            />
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as string)}>
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh} loading={loading}>
              <RefreshCw className="size-3.5" aria-hidden />
              Refresh
            </Button>
          </div>
        }
      />
      <PanelBody className="space-y-adm-4">
        {loading ? (
          <Skeleton className="h-[400px]" />
        ) : error ? (
          <ErrorState title="Knowledge base unavailable" description={error} onRetry={handleRefresh} retryLabel="Try again" />
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No knowledge chunks found"
            description="No documents match your search and filters."
          />
        ) : (
          <>
            <TableWrap>
              <Table>
                <THead>
                  <TR>
                    <TH>Title</TH>
                    <TH className="hidden sm:table-cell">Category</TH>
                    <TH className="hidden sm:table-cell">Keywords</TH>
                    <TH className="text-right">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredDocs.map((d) => (
                    <TR
                      key={d.id}
                      onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                      className={`cursor-pointer border-b border-adm-line/50 last:border-b-0 transition-colors duration-adm ease-adm ${
                        expandedId === d.id ? "bg-adm-surface-2" : "hover:bg-adm-surface-2"
                      }`}
                    >
                      <TD className="px-adm-4 py-adm-3">
                        <div className="font-medium text-adm-fg truncate">{d.title}</div>
                        <div className="mt-0.5 text-[11px] text-adm-muted truncate">{d.id}</div>
                      </TD>
                      <TD className="hidden sm:table-cell px-adm-4 py-adm-3 text-[12px] text-adm-muted">
                        {d.category}
                      </TD>
                      <TD className="hidden sm:table-cell px-adm-4 py-adm-3 text-[12px] text-adm-muted truncate max-w-[200px]">
                        {d.keywords.slice(0, 5).join(", ") || "—"}
                      </TD>
                      <TD className="px-adm-4 py-adm-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setExpandedId(expandedId === d.id ? null : d.id);
                          }}
                        >
                          {expandedId === d.id ? (
                            <ChevronRight className="size-3.5 rotate-180" aria-hidden />
                          ) : (
                            <ChevronRight className="size-3.5" aria-hidden />
                          )}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleRemove(d.id);
                          }}
                          loading={updatingId === d.id}
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrap>

            {expandedDoc && (
              <div className="p-adm-4 bg-adm-surface-2 rounded-adm border border-adm-line">
                <div className="flex items-center justify-between gap-adm-3 mb-adm-3">
                  <h4 className="text-[13px] font-semibold text-adm-fg">Full content — {expandedDoc.title}</h4>
                  <Badge tone="neutral" size="sm">{expandedDoc.category}</Badge>
                </div>
                <p className="text-adm-fg whitespace-pre-wrap break-words mb-adm-3">{expandedDoc.content}</p>
                {expandedDoc.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-adm-2 mb-adm-3">
                    {expandedDoc.keywords.map((k) => (
                      <Badge key={k} tone="info" size="sm">{k}</Badge>
                    ))}
                  </div>
                )}
                {expandedDoc.metadata && Object.keys(expandedDoc.metadata).length > 0 && (
                  <div className="text-[11px] text-adm-subtle">
                    {Object.entries(expandedDoc.metadata).map(([k, v]) => (
                      <div key={k} className="flex justify-between mb-0.5">
                        <span>{String(k)}:</span>
                        <span className="ml-1 text-adm-fg">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {creating && (
              <Panel className="border-adm-line-strong">
                <PanelHeader title="Add knowledge chunk" description="Create a new knowledge base entry." />
                <PanelBody className="space-y-adm-4">
                  <Field label="ID (slug)">
                    <Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
                  </Field>
                  <Field label="Title">
                    <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                  </Field>
                  <Field label="Category">
                    <Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
                  </Field>
                  <Field label="Keywords (comma separated)">
                    <Input value={draft.keywords} onChange={(e) => setDraft({ ...draft, keywords: e.target.value })} />
                  </Field>
                  <Field label="Content">
                    <Textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
                  </Field>
                  <PanelFooter className="flex justify-end gap-adm-3">
                    <Button variant="outline" size="sm" onClick={() => setCreating(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleAdd} loading={updatingId === "add"}>
                      {updatingId === "add" ? "Adding…" : "Save chunk"}
                    </Button>
                  </PanelFooter>
                </PanelBody>
              </Panel>
            )}
          </>
        )}
      </PanelBody>
    </Panel>
  );
}
