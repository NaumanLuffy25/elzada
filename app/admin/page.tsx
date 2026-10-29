import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { EnquiriesTable } from "@/components/admin/enquiries-table";
import { ConversationsTable } from "@/components/admin/conversations-table";
import { KnowledgeBasePanel } from "@/components/admin/knowledge-base-panel";
import { MlMetrics } from "@/components/admin/ml-metrics";
import { RagMonitoring } from "@/components/admin/rag-monitoring";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { SystemHealth } from "@/components/admin/system-health";
import { PageHeader } from "@/components/admin/page-header";
import { Badge, SectionAnchor } from "@/components/admin/ui";

export const metadata = { title: "Operations dashboard" };

/**
 * Reported from the real runtime instead of a hardcoded string, so the console
 * never claims "production" while running locally.
 */
const environment = process.env.NODE_ENV === "production" ? "Production" : "Development";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Operations dashboard"
        description="Real-time visibility into the AI admission counsellor, enquiries, knowledge base and system health."
        actions={
          <Badge tone="neutral" size="sm" dot>
            {environment}
          </Badge>
        }
      />

      <div className="mt-adm-6 space-y-adm-6">
        <SectionAnchor id="intent-model">
          <MlMetrics />
        </SectionAnchor>

        <SectionAnchor id="overview">
          <DashboardOverview />
        </SectionAnchor>

        <SectionAnchor id="analytics">
          <AnalyticsCharts />
        </SectionAnchor>

        <div className="grid gap-adm-6 lg:grid-cols-12">
          <SectionAnchor id="enquiries" className="lg:col-span-7">
            <EnquiriesTable />
          </SectionAnchor>
          <SectionAnchor id="conversations" className="lg:col-span-5">
            <ConversationsTable />
          </SectionAnchor>
        </div>

        <SectionAnchor id="rag-health">
          <RagMonitoring />
        </SectionAnchor>

        <SectionAnchor id="knowledge-base">
          <KnowledgeBasePanel />
        </SectionAnchor>

        <SectionAnchor id="system-health">
          <SystemHealth />
        </SectionAnchor>
      </div>
    </>
  );
}
