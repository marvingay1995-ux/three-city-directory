# Operations and hypothetical budget

This comparison is assumption-based. No vendor, region, spend, price or architecture is approved. Monetary rates are **TBD pending dated quotes and country clearance**. Quantities are planning inputs, not benchmarks. Shared infrastructure is conditional on approved residency and transfer treatment.

| Cost component | A. One-country pilot, managed runtime and managed database | B. Three-city staged operation, region-separated small stacks |
| --- | --- | --- |
| Domains and identity | One domain and one renewal per year, amortized monthly. One-time time for DNS/TLS ownership setup. | One primary domain and potential local domains, subject to counsel. Track each renewal and zone recovery. |
| Hosting | One small app service plus restricted staging, preapproved region, scale-to-zero only if latency verified. | Up to three isolated app environments plus staging. Test quotas, egress, TLS and cross-region blast radius. |
| Database | One managed PostgreSQL instance, private access, backups and restore drill. | Up to three data partitions/instances plus backup copies in approved regions. Forecast storage, backups and data transfer separately. |
| Storage/media | One private bucket, synthetic pilot fixtures until media approved. Price GB-month + operations + approved egress. | Per-region private buckets with scan/quarantine and lifecycle rules. Price by approved media volume and derivatives. |
| Email | Transactional domain/mailbox and provider minimum only if approved. Estimate messages and retries without marketing. | Regional language templates and routing, processor review, support inbox coverage and higher message quota. |
| Logging/security | Minimal redacted operational logs, alerts and protected audit export. Price ingestion, retention and backup, including access oversight. | Per-region collection and retention. Central summaries only if approved. Include security review, credential rotation and data access audits. |
| Moderation/support | Planning assumption 15 items/week × 12 minutes plus 2 hours/week queue checks, about 22 staff-hours/month. | Assumption 75/week × 15 minutes plus 6 hours/week escalations, about 107 staff-hours/month across city and language coverage. |
| Legal/privacy and setup | One country opinion, entity/licence assessment, procurement, accessibility/security review and setup labor. Recurring counsel hours and renewals TBD. | Three country opinions, transfer/processor mapping, review of region separation and multilingual obligations. Renewals and periodic local counsel TBD. |
| Contingency | Illustrative 20% on approved setup and recurring subtotal, plus incident staffing reserve. | Illustrative 30% on approved subtotals for redundancy, localization and policy churn, plus incident staffing reserve. |

**One-time budget formula:** authorized registration/permit quotes + local counsel and security/accessibility review quotes + setup, migration design and rehearsal hours × loaded hourly rates + contingency. **Monthly formula:** infrastructure minima + metered compute/egress/storage/email/logs + staff hours × approved loaded rates + annual domains and renewals ÷ 12 + counsel reserve + contingency. Finance must document currency, taxes, exchange assumptions, minimum commitments, support coverage and cancellation terms before procurement. Staff estimates use 4.33 weeks/month and exclude overnight coverage.

## Reliability requirements

Propose alerting on availability, latency, 5xx, queue age, backup age and privilege changes. Separate per-city service health and synthetic checks from visitor analytics. Agree on owners, paging and escalation thresholds. Set measurable SLOs and recovery objectives only after a workload exercise and business impact review. Define downtime decisions, rollback/redeploy with a known build and database version, migration rollback/reconciliation, feature kill switches, tested backups, restore verification, and city-scoped incident containment. Run incident, fraud and appeal tabletop exercises before sign-off. No production SLA, region, architecture or operating budget has been established.

See [G5](release-gates.md) for exit evidence.
