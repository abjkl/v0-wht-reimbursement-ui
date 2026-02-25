# PRD: WHT Reimbursement Review Tool

| Item | Detail |
|------|--------|
| Product Name | WHT Reimbursement Review Tool |
| Version | 1.0 (MVP) |
| Owner | Tax Operations Team |
| Target Market | Indonesia (PPh23 Withholding Tax) |
| Target Users | Internal Tax Reviewers / Approvers |

---

## 1. Background & Problem Statement

Shopee Indonesia sellers/merchants submit WHT (Withholding Tax / PPh23) reimbursement requests. Currently, tax reviewers manually verify each request by cross-checking uploaded documents (WHT Slip, Tax Invoice, Shopee Invoice) against business rules. This process is time-consuming, error-prone, and lacks standardized validation.

**Core Problem**: Tax reviewers need an efficient tool to review, validate, and approve/reject WHT reimbursement requests with AI-assisted automation while retaining full human override capability.

---

## 2. Goals

| Goal | Metric |
|------|--------|
| Reduce average review time per request | From ~15 min to < 5 min |
| Improve validation accuracy | AI auto-detection of mismatches and anomalies |
| Standardize review workflow | Consistent validation checklist across all reviewers |
| Maintain auditability | Full traceability of AI suggestions vs human decisions |

---

## 3. User Roles

| Role | Permissions |
|------|-------------|
| Tax Reviewer | View requests, review parsed fields, accept/reject AI suggestions, approve/reject requests |
| Tax Manager | All reviewer permissions + bulk operations (future) |

---

## 4. Core Features

### 4.1 Request List Page (`/wht-requests`)

A filterable, tabbed table view of all WHT reimbursement requests.

**Status Tabs**:
- All: All requests
- To Review: `Submitted` + `Pending Review` status
- Approved (Not Injected): Approved but injection not yet complete
- Rejected: Rejected requests

**Filter Dimensions**:

| Filter | Options |
|--------|---------|
| Status | Submitted, Pending Review, Approved, Rejected |
| Transaction Type | MP Platform, Food Platform Invoice, SVS Prepaid Invoice, AMS PPS, AMS PPP, FBS |
| Seller Type | Mall, Non-mall, Merchant |
| Injection Status | Done, Not Started, Failed |
| Approver | All, Empty, Me |
| Date Range | Start date ~ End date |
| Search | Free text (ID, company name, invoice number) |
| Missing Docs | Missing WHT Slip, Missing Tax Invoice, Missing Shopee Invoice, Complete |
| Amount Range | <= 1,000,000 / 1,000,001-10,000,000 / > 10,000,000 |
| SLA | > 3 days |

**Table Columns**:
- Request ID, Status, Seller Company, Transaction Type, Seller Type
- Requested Amount (formatted as IDR)
- Submission Date, AI Suggestion (Approve/Reject/Pending Review), AI Confidence
- Document Completeness (3 docs indicator)
- Injection Status
- Approver Name

Click a row to navigate to the detail page.

---

### 4.2 Request Detail Page (`/wht-requests/[id]`)

A three-panel layout for reviewing a single WHT reimbursement request.

#### 4.2.1 Layout Structure

```
+---------------------------------------+
| Header Bar (Back / Request ID / Badge)|
+----------+----------+-----------------+
| Document | Parsed   | AI Assistant    |
| Viewer   | Fields   | Drawer (340px)  |
| (PDF)    | Panel    |                 |
|          |          |                 |
+----------+----------+-----------------+
| Sticky Bottom Action Bar              |
+---------------------------------------+
```

**Header Bar**: Slim single-line bar with:
- Back navigation to list
- Request ID + Status badge
- "Attachments" button
- "AI Review" toggle button (show/hide AI drawer)

#### 4.2.2 Left Panel: Document Viewer

Tab-based PDF/image viewer for the 3 source documents:

| Tab | Document | Source |
|-----|----------|--------|
| WHT Slip | Bukti Potong PPh23 | Uploaded by requestor |
| Tax Invoice | Faktur Pajak | Uploaded by requestor |
| Shopee Invoice | Commercial Invoice | Uploaded by requestor |

Features:
- Zoom in/out (50%-200%)
- External link to open original document
- "Document Not Provided" placeholder for missing docs
- Tab switching automatically syncs the parsed fields panel

#### 4.2.3 Middle Panel: Parsed Fields (Document Context Panel)

Displays OCR/AI-extracted key fields from the currently selected document tab. Fields are organized in a card layout with section separators.

**WHT Slip Fields**:
| Field | Type | Description |
|-------|------|-------------|
| WHT Slip Number (Nomor Bukti Potong) | String | Unique ID of the WHT slip |
| Tax Period / Masa Pajak | String | MM-YYYY format |
| WHT Code | String | Tax article code (e.g., 24-104-18) |
| WHT Rate (%) | Number | Expected: 2% |
| Taxpayer NPWP (Shopee) | String | Entity being taxed |
| Taxpayer Name (Shopee) | String | Entity name |
| Collector NPWP (Seller/Merchant) | String | Tax collector NPWP |
| Collector Name (Seller/Merchant) | String | Tax collector name |
| Tax Base / DPP | Money (IDR) | Dasar Pengenaan Pajak |
| WHT Amount (PPh23) | Money (IDR) | Calculated tax amount |
| Referenced Invoice Number | String | Links to tax/shopee invoice |

**Tax Invoice Fields**:
| Field | Type | Description |
|-------|------|-------------|
| Tax Invoice Number | String | Nomor Faktur Pajak |
| Tax Invoice Date | Date | Issue date |
| Issuer NPWP | String | Should match WHT slip taxpayer |
| Issuer Name | String | Should match WHT slip taxpayer |
| Buyer NPWP | String | Should match WHT slip collector |
| Buyer Name | String | Should match WHT slip collector |
| DPP (Tax Base) | Money (IDR) | Should match WHT slip tax base |
| VAT Amount (PPN) | Money (IDR) | 11% VAT |
| Total Amount | Money (IDR) | DPP + VAT |

**Shopee Invoice Fields**:
| Field | Type | Description |
|-------|------|-------------|
| Invoice Number (OCR) | String | OCR-extracted invoice number |
| Invoice Date | Date | Invoice issue date |
| Issuer Name | String | Shopee entity name |
| Issuer NPWP | String | Shopee entity NPWP |
| Amount Before Tax | Money (IDR) | Pre-tax amount |
| Total Amount | Money (IDR) | Total invoice amount |
| Currency | String | Expected: IDR |
| Line Item Count | Number | Number of line items |
| Invoice Description | String | Free-text description |

**Field Behaviors**:
- Each field is **editable** (inline edit with pencil icon on hover)
- Each field shows a **source indicator**:
  - Sparkle icon (amber) = AI parsed
  - User avatar (initials circle) = Manually updated by a human, with tooltip showing email
- **Issue highlighting**: When "Check Details" is clicked from AI drawer, fields with validation problems get a colored border (red = fail, amber = warn) and an issue badge icon with tooltip reason. Non-issue fields are dimmed to 30% opacity. A "Clear highlights" link dismisses the overlay.

#### 4.2.4 Right Panel: AI Assistant Drawer

A collapsible 340px right-side panel for AI review results. Toggled via the "AI Review" button in the header.

**Architecture**: The AI Assistant supports **multiple agents** (extensible). Currently one agent is implemented.

**Panel Structure**:
```
+----------------------------------+
| [Sparkle] AI Assistant           |
| Review tasks & conclusions  [x]  |
+----------------------------------+
| REQUIRED TASKS    0/1 confirmed  |
+----------------------------------+
| [Agent Card: WHT Slip Review]    |
|  - Conclusion badge + confidence |
|  - Re-run button                 |
|  - Details (validation checks)   |
|  - User action (Accept/Not/Check)|
+----------------------------------+
| [Future Agent Cards...]          |
+----------------------------------+
| Final Decision                   |
| [Reject] [Accept]               |
+----------------------------------+
```

**Agent Card** (WHT Slip Review):

| Section | Description |
|---------|-------------|
| Header | Agent name + conclusion badge (Approve/Reject/Pending) with confidence % |
| Status Circle | Empty (pending), green check (accepted), red X (not accepted) |
| Re-run | Button to re-run AI validation checks |
| Details | Expandable sections grouped by validation category |
| Action | Approve/Reject -> "Accept" / "Not Accept" buttons; Pending Review -> "Check Details" button (triggers field highlighting) |

**Conclusion Types**:

| Conclusion | Badge Color | Action Buttons |
|------------|-------------|----------------|
| Approve | Green | Accept / Not Accept |
| Reject | Red | Accept / Not Accept |
| Pending Review | Amber | Check Details |

---

### 4.3 Validation Engine (AI Agent: WHT Slip Review)

The core validation logic that cross-checks extracted document data. Organized into 5 sections:

#### Section A: Document Completeness

| Check | Rule | Status |
|-------|------|--------|
| WHT Slip Uploaded | WHT slip URL exists | Pass / Fail |
| Tax Invoice Uploaded | Tax invoice URL exists | Pass / Fail |
| Shopee Invoice Uploaded | Shopee invoice URL exists | Pass / Fail |

#### Section B: Identity Validation

| Check | Rule | Status |
|-------|------|--------|
| Entity Identity Match (Shopee) | WHT slip taxpayer NPWP/Name = Tax invoice issuer NPWP/Name | Pass / Warn / Fail |
| Collector Identity Match (Seller/Merchant) | WHT slip collector NPWP/Name = Tax invoice buyer NPWP/Name | Pass / Warn / Fail |

#### Section C: Invoice Matching

| Check | Rule | Status |
|-------|------|--------|
| Invoice Reference Match (B9) | WHT slip referenced invoice number matches tax invoice number or Shopee invoice number | Pass / Warn / Fail |
| Single Invoice per Slip | MVP: one request = one invoice | Always Pass |

#### Section D: Tax Calculation

| Check | Rule | Status |
|-------|------|--------|
| WHT Code Allowed (B3) | Must be one of: `24-104-18`, `24-104-34`, `24-104-02` | Pass / Warn / Fail |
| WHT Rate = 2% (B6) | Rate must be exactly 2% | Pass / Warn / Fail |
| Tax Base Match (B5) | WHT slip tax base = Tax invoice DPP | Pass / Warn / Fail |
| WHT Amount Correct (B7) | WHT amount = 2% of tax base (tolerance: +/- IDR 10) | Pass / Warn / Fail |
| Requested Amount Matches WHT | Requested reimbursement amount ~= WHT slip amount (tolerance: +/- IDR 10) | Pass / Warn |

#### Section E: Compliance & Eligibility

| Check | Rule | Status |
|-------|------|--------|
| Not in Exemption Period (SKB) | Seller must not have active tax exemption certificate | Pass / Warn / Fail |
| Not Duplicate Submission | Request must not be a duplicate | Pass / Warn / Fail |
| Eligible for Reimbursement | Seller type and transaction type eligible | Pass / Warn / Fail |

**Check Status Legend**:
- **Pass** (green): Validation passed
- **Warn** (amber): Data not available or minor discrepancy
- **Fail** (red): Validation failed, requires attention

---

### 4.4 Approval Workflow

#### Bottom Action Bar

Sticky footer with context-dependent actions:

| Scenario | Actions Available |
|----------|-------------------|
| AI suggests Approve/Reject | "Accept AI Suggestion (Approve/Reject) XX%" + "Or decide manually" link |
| AI suggests Pending Review | Manual "Approve" + "Reject to Requestor" buttons |
| Manual decision expanded | "Approve" + "Reject to Requestor" buttons |
| "Next Request" | Navigate to next request in queue |

#### Approve Dialog

Confirmation dialog with:
- Notes field (optional)
- Confirm / Cancel buttons
- On confirm: status -> `Approved`, logs audit entry

#### Reject Dialog

Confirmation dialog with:
- Multi-select rejection reasons:
  - Missing or incomplete documentation
  - Invoice number mismatch
  - Invalid amount
  - Company information incomplete
  - Tax invoice issues
  - WHT slip issues
  - Duplicate request
  - Other
- Notes field (optional)
- Confirm / Cancel buttons
- On confirm: status -> `Rejected`, logs audit entry with reasons

---

## 5. Data Model

### 5.1 WHTRequest

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | String | Yes | Unique request ID (e.g., WHT-2026-001) |
| status | Enum | Yes | Submitted / Pending Review / Approved / Rejected |
| transactionType | Enum | Yes | MP Platform / Food Platform Invoice / SVS Prepaid Invoice / AMS PPS / AMS PPP / FBS |
| sellerType | Enum | Yes | Mall / Non-mall / Merchant |
| aiSuggestion | Enum | Yes | Approve / Reject / Pending Review |
| aiConfidence | Float | Yes | 0.0 - 1.0 |
| timestamp | ISO DateTime | Yes | Request creation time |
| requestorEmail | String | Yes | Submitter email |
| sellerCompanyName | String | Yes | From Google Form "Nama Perusahaan" |
| invoiceNumber | String | Yes | Primary invoice reference |
| invoiceUrl | URL | No | Shopee invoice document URL |
| taxInvoiceUrl | URL | No | Tax invoice document URL |
| whtSlipUrl | URL | No | WHT slip document URL |
| requestedReimbursementAmount | Number (IDR) | Yes | Amount requested for reimbursement |
| submissionDate | Date | Yes | Date of submission |
| approvalStatusYN | Y/N | No | Approval outcome |
| approverName | String | No | Approver email |
| approvalDate | Date | No | Date of decision |
| notes | String | No | Reviewer notes |
| injectionStatus | Enum | Yes | Done / Not Started / Failed |
| injectionDate | Date | No | Date of injection |
| docsComplete | Object | Yes | { invoice: bool, taxInvoice: bool, whtSlip: bool } |
| extracted | Object | No | OCR/AI extracted data (see 4.2.3) |
| eligibility | Object | No | { isEligible: bool, reason?: string } |
| duplicate | Object | No | { isDuplicate: bool } |
| exemptionPeriod | Object | No | { isInExemption: bool } |

### 5.2 Field Metadata

Each extracted field can carry metadata:

| Field | Type | Description |
|-------|------|-------------|
| source | Enum | `ai` (OCR/AI parsed) or `user` (manually updated) |
| updatedBy | String | User email who last modified |
| updatedAt | ISO DateTime | Timestamp of last modification |

### 5.3 MP-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| usernameShopee | String | Shopee username |
| shopId | String | Shopee shop ID |
| userId | String | Shopee user ID |

### 5.4 Food-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| merchantName | String | Merchant display name |
| merchantId | String | Merchant ID |
| storeId | String | Store ID |
| settleTo | String | Settlement target (MID/SID) |
| midSid | String | MID or SID identifier |

---

## 6. Technical Architecture

### 6.1 Frontend Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| State Management | Zustand |
| Language | TypeScript |

### 6.2 Component Structure

```
app/
  wht-requests/
    page.tsx                    # List page
    [id]/
      page.tsx                  # Detail page (main orchestrator)

components/
  filters-bar.tsx               # Filter controls
  requests-table.tsx            # Data table
  document-viewer.tsx           # PDF/image viewer with tabs
  document-context-panel.tsx    # Parsed fields display (3 doc types)
  editable-field.tsx            # Inline-editable field with source indicator
  ai-review-drawer.tsx          # AI Assistant right-side drawer
  audit-log.tsx                 # Audit log display

lib/
  types.ts                      # TypeScript type definitions
  store.ts                      # Zustand store
  mock-data.ts                  # Mock request data (20 records)
  filter-utils.ts               # Filter and format utility functions
```

### 6.3 Key Interactions

| Interaction | Flow |
|-------------|------|
| Tab switch (Document Viewer) | Viewer tab change -> syncs Parsed Fields panel to show corresponding document fields |
| Check Details (AI Drawer) | Click "Check Details" -> maps failed/warn validation checks to field names -> highlights issue fields, dims clean fields |
| Clear Highlights | Click "Clear highlights" in panel header -> removes all field overlays |
| Accept AI Suggestion | Click "Accept" in Agent Card -> marks agent as accepted -> can proceed to Final Decision |
| Re-run Agent | Click "Re-run" in Agent Card -> re-executes validation (2s simulated delay) -> resets acceptance state |
| Approve/Reject | Bottom bar or AI drawer Final Decision -> opens confirmation dialog -> updates status + logs audit entry |
| Inline Edit Field | Hover field -> pencil icon -> click to edit -> Enter to save / Escape to cancel |

---

## 7. Future Considerations (Out of Scope for MVP)

| Item | Description |
|------|-------------|
| Multiple AI Agents | Architecture supports adding Invoice Review, Tax Review, etc. as additional agent cards |
| Batch Operations | Bulk approve/reject from list page |
| Real OCR Integration | Connect to actual OCR/AI extraction service (currently mock data) |
| Backend API | Replace Zustand store with REST/GraphQL API |
| Role-Based Access | Different permissions for Reviewer vs Manager vs Admin |
| Injection Workflow | Automated injection to downstream financial systems |
| Notification System | Email/Slack alerts for pending reviews |
| Analytics Dashboard | Review throughput, accuracy metrics, SLA compliance |
| Audit Trail Export | Download audit logs as CSV/PDF |
| Multi-country Support | Extend beyond Indonesia WHT to other tax jurisdictions |

---

## 8. Appendix

### 8.1 AI Suggestion Logic

The AI suggestion is determined by the combination of validation check results:
- **Approve**: All checks pass, or only minor warnings
- **Reject**: One or more critical checks fail
- **Pending Review**: Missing documents or data that cannot be automatically verified

### 8.2 Allowed WHT Codes (Indonesia PPh23)

| Code | Description |
|------|-------------|
| 24-104-18 | PPh 23: Sewa dan penghasilan lain (Rent and other income) |
| 24-104-34 | PPh 23: Jasa teknik, manajemen, konsultan (Technical, management, consulting services) |
| 24-104-02 | PPh 23: Jasa lainnya (Other services) |

### 8.3 Amount Formatting

All monetary amounts are displayed in Indonesian Rupiah (IDR) format:
- Example: `Rp 5.000.000` (using Indonesian locale `id-ID`)
- Tolerance for amount matching: +/- IDR 10

### 8.4 Field Source Indicators

| Indicator | Meaning |
|-----------|---------|
| Sparkle icon (amber) | Field value was extracted by AI/OCR |
| User avatar (colored circle with initials) | Field value was manually updated by a human user |
| Red circle (XCircle) | Validation failed for this field |
| Amber triangle (AlertCircle) | Validation warning for this field |
