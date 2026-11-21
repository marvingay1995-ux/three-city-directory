# SEC-017 — Operator fact completion register

**FACT COMPLETION STATUS: PARTIAL OWNER-SUPPLIED PLANNING FACT RECORDED; INDEPENDENT VERIFICATION AND REMAINING OWNER INPUT PENDING.** None of these facts can be completed using repository metadata or speculation. Each row is a *requested fact*, not a data collection authorization. Reference IDs trace to the [SEC-016 operator intake](../sec-016/operator-intake.md).

| ID | SEC-016 link | Fact needed from owner | Current verified value | Internal completion rule |
| --- | --- | --- | --- | --- |
| F17-01 | O16-01 | Prospective operator type, legal name, establishment country | **OWNER-STATED: individual planning to establish a business in Oman; legal name and establishment/registration not confirmed** | Non-sensitive owner statement; legal evidence verified privately by authorized reviewer |
| F17-02 | O16-02 | Commercial registration, actual activities/licences, if any | **OWNER-STATED: no registration confirmed; actual registration and licences UNKNOWN / NOT VERIFIED** | Mark `NONE DECLARED` if none, not `licensed`; counsel must verify |
| F17-03 | O16-03 | Actual Oman presence, authorized business representative | **UNKNOWN** | Owner attests proposed presence and delegated roles; no inference from residence |
| F17-04 | O16-04 | Preferred structure OR-1, OR-2, OR-3 or an explicit alternative | **UNSELECTED** | Owner explicitly selects **for evaluation only** |
| F17-05 | O16-05 | Who owns publishing, creative rejection, disputes and content corrections | **UNASSIGNED** | Named accountable *roles*; actual appointments later |
| F17-06 | O16-06 | Research categories CAT-01–06 to include, exclude or defer | **UNSELECTED / NOT CLEARED** | Owner identifies exact candidate shortlist; counsel decides legality |
| F17-07 | O16-07 | Whether actual businesses, individuals or submissions are envisaged in a later phase | **CURRENT SCOPE: FICTIONAL ONLY** | A proposed future change needs explicit scope amendment |
| F17-08 | O16-08 | Intended visitor audience, language, country reach and access restrictions | **NOT APPROVED; PRIVATE DEMO ONLY** | Owner states scoped hypothesis; independent language/age/access review later |
| F17-09 | O16-09 | Paid-placement pricing basis and prospective contract/billing/refund entity | **UNDECIDED / NOT AUTHORIZED** | Evaluation hypothesis only; no sales or financial activation |
| F17-10 | O16-10 | Potential fields for representatives, ad rights, logs, complaints and reporting | **NO APPROVED LIVE PROCESSING** | Draft purpose/role/data inventory; Privacy sign-off required |
| F17-11 | O16-11 | Locations of hosting, storage, backup, support and vendors | **NOT SELECTED** | No supplier/geography inference; counsel/Privacy input precedes selection |
| F17-12 | O16-12 | Research scope owner, cost ceiling, expiry, stop authority, permitted contacts | **NO BUDGET; NO CONTACT AUTHORITY** | Separate explicit signed authorization for any external action |

## Owner-statement provenance

On **2026-11-22**, the owner explicitly instructed: “For SEC-017, the proposed operator is: an individual planning to establish a business in Oman, with no registration confirmed. Record this as an owner-supplied planning fact only, without authorizing legal engagement, spending or launch.” This establishes **intent only**. It does not assert that the individual is legally registered, currently resident in Oman, authorized to conduct business, or eligible to advertise. **Do not transform “no registration confirmed” into “registration definitively absent.”**

## Handling and provenance

- Public-safe answers may state **type, country, role and whether registration exists**, but do not paste national IDs, passport or residence documents, birth dates, personal home address, bank accounts, private contacts, company beneficial-owner records or registration scans into the repo.
- If an owner has not supplied a fact, keep **UNKNOWN**, **UNSELECTED**, **PENDING** or **NOT AUTHORIZED**. A zero or “none” requires an explicit owner assertion, not an assumption.
- A future professional opinion must independently verify registration and licensing with the applicable authority and current instruments; this file cannot certify compliance.
- Even a fully filled non-sensitive register cannot authorize contact, services, spend, public site, advertising or release.

**Closure test:** all F17-01–12 must have accurate source/date, marked assumptions and unresolved questions. Until then, **FACT COMPLETION BLOCKED**. Changing the operator, scope or data flows reopens relevant D7 and G1–G6 review.
