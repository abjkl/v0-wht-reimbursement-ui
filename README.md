# Indonesia WHT Reimbursement System

Internal admin UI for Indonesia WHT (PPh 23) reimbursement processing - Tax x Ops processing workspace.

## Features

### Page 1: All Requests List (`/wht-requests`)

- **Quick View Tabs:**
  - To Review (Submitted + Pending Review)
  - Approved (Not Injected)
  - Rejected
  - All Requests

- **Comprehensive Filters:**
  - Status (Submitted, Pending Review, Approved, Rejected)
  - Transaction Type (MP Platform, Food Platform Invoice, SVS Prepaid, AMS PPS, AMS PPP, FBS)
  - Party Type (Mall, Non-mall, Merchant)
  - Injection Status (Done, Not Started, Failed)
  - Document Status (Complete, Missing specific docs)
  - Amount Range (≤1M, 1M-10M, >10M IDR)
  - SLA/Aging (Submitted > 3 days)
  - Global Search (ID, email, company, invoice, IDs)

- **Data Table:**
  - 16 columns showing comprehensive request information
  - Document completeness indicators with tooltips
  - AI suggestion badges with confidence percentages
  - Sortable and clickable rows
  - Real-time filtering

### Page 2: Request Detail (`/wht-requests/[id]`)

- **Two-Panel Layout:**
  - Left (40%): Request details, AI review, actions, audit log
  - Right (60%): Document viewer with 3 tabs

- **Document Viewer:**
  - WHT Slip, Tax Invoice, Shopee Invoice tabs
  - PDF iframe embed or image display
  - Zoom controls (+/-)
  - Open in new tab option
  - Missing document empty states

- **AI Review Panel:**
  - Suggestion badge (Approve/Reject/Pending Review)
  - Confidence score with progress bar
  - Validation checklist (documents, invoice, amount, company info)

- **Actions:**
  - Accept AI Suggestion (one-click)
  - Manual Approve/Reject with confirmation dialogs
  - Rejection reasons (multi-select)
  - Optional notes for both approve/reject
  - Next request navigation

- **Audit Log:**
  - Chronological timeline of all actions
  - Actor, action, timestamp, details
  - Auto-updates on status changes

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Icons:** lucide-react
- **State Management:** Zustand (client-side)
- **Data:** Mock data (20+ requests)

## Data Model

Supports both MP Platform and Food Platform transactions with:
- Common fields (invoice, amounts, dates, approvals)
- MP-specific (shopId, userId, username)
- Food-specific (merchantId, storeId, MID/SID)
- Document completeness tracking (3 docs)
- Injection status tracking
- Complete audit trail

## Mock Data

20 sample requests with varied:
- Transaction types (MP, Food, SVS, AMS, FBS)
- Statuses (Submitted, Pending, Approved, Rejected)
- Party types (Mall, Non-mall, Merchant)
- Document completeness (some missing docs)
- Injection statuses (Done, Not Started, Failed)
- AI suggestions with confidence scores

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - will auto-redirect to `/wht-requests`.

## Key Features

✅ Dark enterprise theme (Vercel-inspired)
✅ Fully responsive design
✅ Real-time filtering and search
✅ AI-powered review suggestions
✅ Document viewer with zoom
✅ Comprehensive approval workflow
✅ Audit trail tracking
✅ Toast notifications
✅ Client-side state management
✅ Type-safe TypeScript
