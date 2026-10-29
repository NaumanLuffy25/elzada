/**
 * Admin UI kit — the shared, reusable foundation for the console.
 *
 * Import from here (`@/components/admin/ui`) rather than deep paths so later
 * migrations have a single entry point.
 */
export { Button, IconButton, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

export { Field, Input, SearchInput, Select, Textarea } from "./input";
export type { FieldProps } from "./input";

export { Badge, badgeVariants } from "./badge";
export type { BadgeProps } from "./badge";

export {
  Table,
  TableWrap,
  TBody,
  TD,
  TDCell,
  TH,
  THead,
  TR,
} from "./table";

export { Panel, PanelBody, PanelFooter, PanelHeader, SectionAnchor } from "./panel";
export type { PanelHeaderProps } from "./panel";

export { KpiCard, KpiGrid } from "./kpi-card";
export type { KpiCardProps } from "./kpi-card";

export { Alert, EmptyState, ErrorState, LoadingState, Skeleton } from "./feedback";
export type { AlertProps, EmptyStateProps, ErrorStateProps } from "./feedback";
