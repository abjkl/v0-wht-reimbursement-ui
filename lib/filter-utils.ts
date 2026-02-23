import type { WHTRequest, FilterState } from './types';

export function filterRequests(
  requests: WHTRequest[],
  filters: FilterState
): WHTRequest[] {
  return requests.filter((req) => {
    // Status filter
    if (filters.status !== "All" && req.status !== filters.status) {
      return false;
    }

    // Transaction Type filter
    if (
      filters.transactionType !== "All" &&
      req.transactionType !== filters.transactionType
    ) {
      return false;
    }

    // Seller Type filter
    if (
      filters.sellerType !== "All" &&
      req.sellerType !== filters.sellerType
    ) {
      return false;
    }

    // Injection Status filter
    if (
      filters.injectionStatus !== "All" &&
      req.injectionStatus !== filters.injectionStatus
    ) {
      return false;
    }

    // Approver filter
    if (filters.approver !== "All") {
      if (filters.approver === "Empty" && req.approverName) {
        return false;
      }
      if (
        filters.approver === "Me" &&
        req.approverName !== "tax.manager@company.com"
      ) {
        return false;
      }
      if (
        filters.approver !== "Empty" &&
        filters.approver !== "Me" &&
        req.approverName !== filters.approver
      ) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange.start) {
      if (req.submissionDate < filters.dateRange.start) {
        return false;
      }
    }
    if (filters.dateRange.end) {
      if (req.submissionDate > filters.dateRange.end) {
        return false;
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchFields = [
        req.id,
        req.requestorEmail,
        req.companyName,
        req.invoiceNumber,
        req.shopId,
        req.userId,
        req.usernameShopee,
        req.merchantId,
        req.storeId,
        req.merchantName,
        req.midSid
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchFields.includes(searchLower)) {
        return false;
      }
    }

    // Missing Docs filter
    if (filters.missingDocs !== "All") {
      if (filters.missingDocs === "Missing WHT Slip" && req.docsComplete.whtSlip) {
        return false;
      }
      if (filters.missingDocs === "Missing Tax Invoice" && req.docsComplete.taxInvoice) {
        return false;
      }
      if (filters.missingDocs === "Missing Shopee Invoice" && req.docsComplete.invoice) {
        return false;
      }
      if (
        filters.missingDocs === "Complete" &&
        (!req.docsComplete.invoice ||
          !req.docsComplete.taxInvoice ||
          !req.docsComplete.whtSlip)
      ) {
        return false;
      }
    }

    // Amount range filter
    if (filters.amountRange !== "All") {
      const amount = req.requestedReimbursementAmount;
      if (filters.amountRange === "<= 1000000" && amount > 1000000) {
        return false;
      }
      if (
        filters.amountRange === "1000001-10000000" &&
        (amount <= 1000000 || amount > 10000000)
      ) {
        return false;
      }
      if (filters.amountRange === "> 10000000" && amount <= 10000000) {
        return false;
      }
    }

    // SLA filter
    if (filters.sla === "> 3 days") {
      const submissionDate = new Date(req.submissionDate);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 3) {
        return false;
      }
    }

    return true;
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getDocCompletionCount(req: WHTRequest): string {
  const count = [
    req.docsComplete.invoice,
    req.docsComplete.taxInvoice,
    req.docsComplete.whtSlip
  ].filter(Boolean).length;
  return `${count}/3`;
}
