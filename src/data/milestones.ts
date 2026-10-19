/**
 * Public proof points. A milestone is only rendered when `verified` AND
 * `display` are true AND an evidence reference + approver are recorded.
 * Never enter projected or estimated figures here.
 */
export interface Milestone {
  id: string;
  metric: "units_sold" | "customers" | "cities" | "artisan_collaboration" | "press";
  value: string; // e.g. "100+"
  label: string; // e.g. "straps sold"
  asOf: string | null;
  evidenceRef: string | null; // internal reference to the reconciled export
  approvedBy: string | null;
  approvedAt: string | null;
  verified: boolean;
  display: boolean;
}

export const milestones: Milestone[] = [
  {
    id: "units-100",
    metric: "units_sold",
    value: "100+",
    label: "straps sold",
    asOf: null,
    evidenceRef: null,
    approvedBy: null,
    approvedAt: null,
    verified: false,
    display: false,
  },
];

export const publishableMilestones = () =>
  milestones.filter((m) => m.verified && m.display && m.evidenceRef && m.approvedBy && m.approvedAt);
