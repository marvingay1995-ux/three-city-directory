# SEC-021 — Business Structure Validation & Regulatory Feasibility

**Date:** 2026-11-22  
**Project:** Three City Directory (Dubai / Muscat / Doha)  
**Scope:** Oman / Muscat regulatory research only  
**Decision:** **NO-GO for registration, live listings, payments, commercial operation, or deployment**  
**Evidence level:** Preliminary desk research; **not legal advice, licensing confirmation, or regulatory approval**.

## 1. Continuity and controlling decisions

- SEC-020 is merged as PR #69. Its commit title explicitly says **"owner choice pending"**. **Do not infer that a legal form was selected.** Preserve all SEC-020 documents and decisions unchanged.
- Proposed operator: individual intending to establish a business in Oman; registration is not confirmed (owner-supplied planning fact from SEC-017).
- Sponsored advertising directory is a **model under evaluation**, not authorization to sell advertising.
- Website remains a fictional/demo prototype. No real people, advertiser submissions, bookings, contact flows, authentication, payment processing, integrations, public deployment, or spending.
- SEC-021 cannot override SEC-020, choose a structure on behalf of the owner, or treat a generic digital advertising activity as permission to publish escort advertisements.

## 2. Evidence and verification convention

**VERIFIED GENERAL RULE** means a cited official source describes a general procedure; it does *not* verify eligibility of this operator or business.  
**PENDING** means no competent-authority written confirmation or qualified Oman-specific legal assessment for the exact business and operator has been obtained.  
**BLOCKED** means an action is not authorized, irrespective of feasibility.

| Question | Current finding | Status | Evidence needed |
|---|---|---|---|
| Which legal structure did the owner choose in SEC-020? | SEC-020 PR #69 title says owner choice pending; no owner decision is evidenced here. | **PENDING** | Explicit documented owner decision, consistent with SEC-020 |
| May this specific individual own and operate the chosen structure? | General foreign-investment routes exist, but nationality, residence/work status, permitted activities, ownership and eligibility must be evaluated together. | **PENDING** | Competent authority / qualified counsel assessment of actual operator and structure |
| Does existing visa/sponsorship permit management or work? | A visa or sponsorship arrangement alone is not proof of business-operation permission. | **PENDING** | Written immigration and labour-status determination |
| What commercial activity code covers an online directory? | Oman Business Platform handles registration and licensing; no verified code for this exact directory. | **PENDING** | Current official code, restrictions and approvals for precise operating model |
| Does a digital advertising / e-commerce licence cover sponsored listings? | Licence requirements depend on activity; generic classification does not establish content permission. | **PENDING** | Written activity-specific licensing confirmation |
| Can escort-related profiles or promotions be published in Oman? | High legal/content risk. No evidence of permission; ordinary advertising licensing must not be used to infer permission. | **PENDING / NO-GO** | Oman-qualified legal opinion and competent-authority confirmation on actual copy, imagery, and conduct |
| Can the platform accept crypto or other payments for ads? | Payment, AML/CFT, banking, processor terms, tax and activity legality have not been cleared. Crypto does not cure an otherwise prohibited underlying activity. | **PENDING / BLOCKED** | Written payment-rail, regulator, tax and legal assessment before any integration |
| Is operation in Dubai or Doha covered by Oman approvals? | No. Separate jurisdictions require separate reviews. | **PENDING / BLOCKED** | Jurisdiction-specific reviews and permissions |

## 3. Official desk-research sources

1. Oman Ministry of Commerce, Industry and Investment Promotion, **Oman Business Platform**: https://tejarah.gov.om/en/service-directory — official single window for company establishment and activity licensing. **General process only**.
2. Gov.om, **Get Investment License** (updated 2026-07-02): https://gov.om/en/w/get-investment-license — describes foreign investment licensing, supporting documents and post-commercial-registration requirements for companies subject to the Foreign Capital Investment Law. **Not proof of eligibility**.
3. Gov.om, **Starting a Business**: https://gov.om/en/w/starting-a-business — lists different registration routes, including LLC and one-person company. **Availability for this operator/activity remains unverified**.
4. Gov.om, **Business Licensing and Permits**: https://gov.om/en/w/business-licensing-and-permits-1 — examples of advertising and promotional approvals. **No source confirms escort advertising permission**.
5. Ministry overview of registration and legal forms: https://tejarah.gov.om/en/media/news/kapdeds6capkqqvm4ufoayp1 — background only; verify against current binding rules and the specific activity.

**Research limitations:** No current official activity code, legally binding classification, explicit escort-advertising permission, approved operator immigration status, or payment-provider approval has been obtained. No authority has been contacted, no legal professional engaged, and no registration submitted.

## 4. Specific legal questions for SEC-022 review

1. Which SEC-020 legal form, if any, is explicitly chosen by the owner, and is it available to this individual?
2. What is the operator's actual immigration/work authorization, and does it permit owning, managing, or performing services for the entity?
3. Which precise Oman Business Platform activity codes correspond to a **paid sponsored online directory**? Which licenses and authorities are required?
4. Are escort profiles, compensated companionship advertisements, suggestive imagery, contact links, and advertiser lead generation lawful in Oman? Distinguish advertising from any underlying prohibited activity; obtain a written assessment of the exact proposed content and mechanics.
5. What obligations apply to moderation, age assurance, identity verification, privacy, recordkeeping, consumer protection, taxation and advertising claims?
6. Would collecting fiat or crypto advertising fees require additional financial permissions, regulated service providers, AML/CFT measures or bank approvals? Are processors willing and permitted to support the category?
7. Which obligations arise independently for Dubai and Doha city pages?
8. What specific documents and competent-authority confirmations would be sufficient to change a NO-GO finding?

## 5. Regulatory risk register

| ID | Risk | Severity | Status | Gate |
|---|---|---|---|---|
| R-01 | Business structure assumed selected when owner choice remains pending | High | Open | Explicit owner selection |
| R-02 | Foreign ownership / immigration / work authorization mismatch | Critical | Open | Qualified eligibility verification |
| R-03 | Incorrect or insufficient commercial activity classification | High | Open | Official classification |
| R-04 | Escort advertising or related content may be prohibited | Critical | Open | Oman-specific written legal and authority review |
| R-05 | Crypto or payment handling creates additional regulatory exposure | High | Open | Payment/legal/tax approvals |
| R-06 | Dubai and Doha pages imply cross-border permissions | High | Open | Separate jurisdiction reviews |
| R-07 | Private demo mistaken for launch-ready platform | High | Open | Explicit release gate and product-owner approval |

## 6. Decision and hard stops

**SEC-021 outcome: DOCUMENTED / REGULATORY FEASIBILITY NOT ESTABLISHED / NO-GO.**

This is a documentation-only assessment. It **does not**:
- amend SEC-020, select a company structure, or establish a company;
- initiate paid legal engagement, spend, advertising campaigns, or regulatory submissions;
- enable real listings, profiles, contact/booking flows, advertiser onboarding, authentication, payment or cryptocurrency integrations;
- authorize deployment, publication, commercial operations, or a launch;
- claim any regulator has approved this project.

## 7. SEC-022 entry criteria

SEC-022 may review this record and request missing evidence. A GO decision requires independently verified operator eligibility, activity classification, content legality, payment feasibility where relevant, and explicit owner authorization. **Missing evidence = PENDING, never PASS.**

## 8. Documentation validation checklist

- [x] Documentation-only scope.
- [x] SEC-020 owner choice preserved as pending; no alteration to prior records.
- [x] Operator eligibility, classification, advertising, payments and open questions documented.
- [x] All project-specific legal conclusions remain PENDING.
- [x] Explicit NO-GO and release/payment/registration prohibitions.
- [ ] Repository CI / automated checks: must be observed and recorded on PR; not presumed.
