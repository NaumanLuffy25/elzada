"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Loader2, Search, RefreshCw, Phone, Mail, Calendar, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

import { cn, formatRelative } from "@/lib/utils";
import type { EnquiryRow } from "@/lib/supabase";
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

type Enquiry = EnquiryRow;

type StatusFilter = "all" | Enquiry["status"];

const STATUS_LABEL: Record<Enquiry["status"], string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  spam: "Spam",
};

const STATUS_TONE: Record<
  Enquiry["status"],
  "neutral" | "accent" | "warning" | "success" | "danger" | "info"
> = {
  new: "info",
  in_progress: "warning",
  resolved: "success",
  spam: "danger",
};

const TOKEN_KEY = "elzada_admin_token";
const PAGE_SIZE = 10;

/** Token present in localStorage? Used to decide whether to call the API. */
function storedToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function EnquiriesTable() {
  const [token, setToken] = useState<string | null>(null); // null → hydrating
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state (all client-side on the fetched page)
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<{ field: keyof Enquiry; dir: "asc" | "desc" }>({
    field: "created_at",
    dir: "desc",
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Read the stored token once, then fetch.
  useEffect(() => {
    setToken(storedToken());
  }, []);

  const fetchEnquiries = useCallback(async (currentToken: string | null) => {
    if (!currentToken) {
      setEnquiries([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // The token travels in a header, never the URL, so it cannot leak into
      // server access logs or browser history.
      const res = await fetch("/api/enquiries?page=1&limit=100", {
        cache: "no-store",
        headers: { "x-admin-token": currentToken },
      });
      if (res.status === 401) {
        setError(
          "The admin API rejected the token. Set ADMIN_DASHBOARD_TOKEN in .env.local and re-enter it here.",
        );
        setEnquiries([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error(`The admin API responded with HTTP ${res.status}.`);
      }
      const json = await res.json();
      setEnquiries(Array.isArray(json.enquiries) ? json.enquiries : []);
      setTotal(typeof json.pagination?.total === "number" ? json.pagination.total : 0);
    } catch (cause: any) {
      setError(cause?.message || "Could not load enquiries.");
      setEnquiries([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token === null) return;
    void fetchEnquiries(token);
  }, [token, fetchEnquiries]);

  // --- Derived: filtered + sorted + paginated ----------------------------
  const filtered = useMemo(() => {
    const qLower = q.toLowerCase();
    return enquiries.filter((e) => {
      const matchQ =
        !qLower ||
        e.name.toLowerCase().includes(qLower) ||
        e.email.toLowerCase().includes(qLower) ||
        (e.program ?? "").toLowerCase().includes(qLower) ||
        e.message.toLowerCase().includes(qLower);
      const matchS = statusFilter === "all" || e.status === statusFilter;
      return matchQ && matchS;
    });
  }, [enquiries, q, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sort.field] ?? "";
      const bv = b[sort.field] ?? "";
      if (av === bv) return 0;
      const cmp = String(av) < String(bv) ? -1 : 1;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const from = (currentPage - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(from, from + PAGE_SIZE);

  // --- Actions -----------------------------------------------------------
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQ(e.target.value);
      setPage(1);
    },
    [],
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter((e.target.value as StatusFilter));
      setPage(1);
    },
    [],
  );

  const handleSort = useCallback((field: keyof Enquiry) => {
    setSort((s) => (s.field === field ? { field, dir: s.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }));
    setPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    if (token !== null) void fetchEnquiries(token);
  }, [token, fetchEnquiries]);

  const openDetail = useCallback((e: Enquiry) => {
    setSelected(e);
  }, []);

  const closeDetail = useCallback(() => {
    setSelected(null);
  }, []);

  const updateStatus = useCallback(
    async (nextStatus: Enquiry["status"]) => {
      if (!selected || !token) return;
      setUpdatingId(selected.id);
      try {
        const res = await fetch("/api/enquiries", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
          body: JSON.stringify({ id: selected.id, status: nextStatus }),
        });
        if (res.status === 401) {
          toast.error("Session expired — set the admin token again.");
          setToken(null);
          return;
        }
        if (!res.ok) throw new Error(`Update failed (HTTP ${res.status}).`);
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Update failed.");

        // Reflect locally without a full refetch (optimistic-ish).
        setEnquiries((rows) =>
          rows.map((r) => (r.id === selected.id ? { ...r, status: nextStatus } : r)),
        );
        setSelected((s) => (s?.id === selected.id ? { ...s, status: nextStatus } : s));
        toast.success("Status updated", {
          description: `Enquiry marked as ${STATUS_LABEL[nextStatus]}.`,
        });
      } catch (cause: any) {
        toast.error("Could not update status", {
          description: cause?.message || "Please try again.",
        });
      } finally {
        setUpdatingId(null);
      }
    },
    [selected, token],
  );

  const statusBadge = (status: Enquiry["status"]) => {
    const meta = STATUS_TONE[status];
    return (
      <Badge tone={meta} size="sm">
        {STATUS_LABEL[status]}
      </Badge>
    );
  };

  // --- Empty / error states ---------------------------------------------
  const hasToken = Boolean(token);
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (loading) {
    return (
      <Panel>
        <PanelHeader
          title="Admission Enquiries"
          description="Inbound form submissions from the public enquiry form."
          icon={Mail}
        />
        <PanelBody className="flex items-center justify-center py-adm-16">
          <LoadingState label="Loading enquiries…" />
        </PanelBody>
      </Panel>
    );
  }

  if (!hasToken) {
    return (
      <Panel>
        <PanelHeader
          title="Admission Enquiries"
          description="Inbound form submissions from the public enquiry form."
          icon={Mail}
        />
        <PanelBody className="py-adm-10">
          <Alert
            tone="info"
            title="Not authorized to view enquiries"
          >
            No admin token is stored in this browser. Enter ADMIN_DASHBOARD_TOKEN in
            .env.local, then paste it via the &quot;Set token&quot; action on the Overview to load
            live enquiry data.
          </Alert>
        </PanelBody>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel>
        <PanelHeader
          title="Admission Enquiries"
          description="Inbound form submissions from the public enquiry form."
          icon={Mail}
        />
        <PanelBody>
          <ErrorState
            title="Enquiries could not be loaded"
            description={error}
            onRetry={() => void fetchEnquiries(token)}
            retryLabel="Try again"
          />
        </PanelBody>
      </Panel>
    );
  }

  const empty =
    supabaseConfigured && total === 0
      ? "No enquiries have been submitted yet. Form submissions from the public enquiry flow will appear here."
      : "No enquiries match your search and filters.";

  return (
    <Panel>
      <PanelHeader
        title="Admission Enquiries"
        description={`${total.toLocaleString("en-IN")} submission${total === 1 ? "" : "s"} across all sources`}
        icon={Mail}
        actions={
          <div className="flex flex-wrap items-center gap-adm-3">
            <SearchInput
              value={q}
              onChange={handleSearch}
              placeholder="Search name, email, programme, message…"
              className="w-[220px] sm:w-[280px]"
            />
            <Select value={statusFilter} onChange={handleStatusChange}>
              <option value="all">All status</option>
              <option value="new">New</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="spam">Spam</option>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh} loading={loading}>
              <RefreshCw className="size-3.5" aria-hidden />
              Refresh
            </Button>
          </div>
        }
      />
      <PanelBody className="space-y-adm-4">
        <TableWrap>
          <Table>
            <THead>
              <TR>
                <TH
                  onClick={() => handleSort("name")}
                  className="cursor-pointer select-none"
                >
                  Name <ArrowUpDown className="size-3.5 ml-1 opacity-40" aria-hidden />
                </TH>
                <TH className="hidden sm:table-cell">Email</TH>
                <TH className="hidden sm:table-cell">Phone</TH>
                <TH
                  onClick={() => handleSort("program")}
                  className="cursor-pointer select-none hidden sm:table-cell"
                >
                  Programme
                </TH>
                <TH
                  onClick={() => handleSort("status")}
                  className="cursor-pointer select-none"
                >
                  Status
                </TH>
                <TH
                  onClick={() => handleSort("created_at")}
                  className="cursor-pointer select-none text-right"
                >
                  Received
                </TH>
                <TH className="text-right">View</TH>
              </TR>
            </THead>
            <TBody>
              {pageRows.length === 0 ? (
                <TR>
                  <TD colSpan={7} className="py-adm-8 text-center text-adm-muted">
                    {empty}
                  </TD>
                </TR>
              ) : (
                pageRows.map((e) => (
                  <TR
                    key={e.id}
                    onClick={() => openDetail(e)}
                    className="cursor-pointer select-none hover:bg-adm-surface-2 transition-colors duration-adm ease-adm border-b border-adm-line/50 last:border-b-0 group"
                  >
                    <TD className="px-adm-4 py-adm-3">
                      <span className="block truncate font-medium text-adm-fg">{e.name}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-adm-muted">{e.email}</span>
                    </TD>
                    <TD className="hidden sm:table-cell px-adm-4 py-adm-3 text-[12px] text-adm-muted whitespace-nowrap">
                      {e.phone ?? "—"}
                    </TD>
                    <TD className="hidden sm:table-cell px-adm-4 py-adm-3 text-[12px] text-adm-muted truncate">
                      {e.program ?? "—"}
                    </TD>
                    <TD className="px-adm-4 py-adm-3">{statusBadge(e.status)}</TD>
                    <TD className="px-adm-4 py-adm-3 text-[12px] text-adm-muted whitespace-nowrap text-right">
                      {formatRelative(e.created_at)}
                    </TD>
                    <TD className="px-adm-4 py-adm-3 text-right">
                      <Button variant="ghost" size="sm" onClick={(ev) => {
                        ev.stopPropagation();
                        openDetail(e);
                      }}>
                        <ChevronRight className="size-3.5" aria-hidden />
                      </Button>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </TableWrap>

        {selected ? (
          <DetailPanel
            enquiry={selected}
            onClose={closeDetail}
            onUpdateStatus={updateStatus}
            updating={updatingId === selected.id}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-adm-3 border-t border-adm-line pt-adm-4">
          <p className="text-[11px] text-adm-muted">
            Showing{" "}
            <span className="font-medium text-adm-fg">
              {Math.min(from + 1, sorted.length)} – {Math.min(from + pageRows.length, sorted.length)}
            </span>{" "}
            of {sorted.length.toLocaleString("en-IN")} matched ({total.toLocaleString("en-IN")} total)
          </p>
          <div className="flex items-center gap-adm-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
            <span className="text-[11px] text-adm-muted">
              Page {currentPage} of {pageCount}
            </span>
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}

/**
 * Slide-out style detail card rendered inline below the table. Shows every field
 * of the selected enquiry plus a status selector that persists via PATCH /api/enquiries.
 */
function DetailPanel({
  enquiry,
  onClose,
  onUpdateStatus,
  updating,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onUpdateStatus: (s: Enquiry["status"]) => void;
  updating: boolean;
}) {
  return (
    <Panel className="mt-adm-4">
      <PanelHeader
        title={`Enquiry details — ${enquiry.name}`}
        description={formatRelative(enquiry.created_at)}
        actions={
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        }
      />
      <PanelBody className="grid gap-adm-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full border-b border-adm-line pb-adm-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-adm-muted">
            Message
          </p>
          <p className="text-adm-fg whitespace-pre-wrap break-words">{enquiry.message}</p>
        </div>
        <Field label="Name">
          <Input value={enquiry.name} readOnly />
        </Field>
        <Field label="Email">
          <Input value={enquiry.email} readOnly />
        </Field>
        <Field label="Phone">
          <Input value={enquiry.phone ?? "—"} readOnly />
        </Field>
        <Field label="Programme">
          <Input value={enquiry.program ?? "—"} readOnly />
        </Field>
        <Field label="Source">
          <Input value={enquiry.source ?? "website"} readOnly />
        </Field>
        <Field label="Status">
          <Select
            value={enquiry.status}
            onChange={(e) => onUpdateStatus(e.target.value as Enquiry["status"])}
            disabled={updating}
          >
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="spam">Spam</option>
          </Select>
        </Field>
        <Field label="Submitted">
          <p className="text-[12px] text-adm-fg">{formatRelative(enquiry.created_at)}</p>
        </Field>
        {enquiry.updated_at && enquiry.updated_at !== enquiry.created_at ? (
          <Field label="Last updated">
            <p className="text-[12px] text-adm-fg">{formatRelative(enquiry.updated_at)}</p>
          </Field>
        ) : null}
        {enquiry.notes ? (
          <Field className="col-span-full" label="Internal notes">
            <p className="text-[12px] text-adm-muted whitespace-pre-wrap">{enquiry.notes}</p>
          </Field>
        ) : null}
      </PanelBody>
      <PanelFooter>
        {updating ? (
          <Button variant="primary" size="sm" disabled>
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            Updating…
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={() => onClose()}>
            Done
          </Button>
        )}
      </PanelFooter>
    </Panel>
  );
}
