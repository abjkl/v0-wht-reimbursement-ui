export type Status = "Submitted" | "Pending Review" | "Approved" | "Rejected";

export type TransactionType =
  | "MP Platform"
  | "Food Platform Invoice"
  | "SVS Prepaid Invoice"
  | "AMS PPS"
  | "AMS PPP"
  | "FBS";

export type SellerType = "Mall" | "Non-mall" | "Merchant";

export type InjectionStatus = "Done" | "Not Started" | "Failed";

export type AISuggestion = "Approve" | "Reject" | "Pending Review";

export interface ExtractedWHTSlip {
  slipNumber?: string;
  taxPeriod?: string;
  taxpayerNpwp?: string;
  taxpayerName?: string;
  collectorNpwp?: string;
  collectorName?: string;
  whtCode?: string;
  whtRate?: number;
  taxBase?: number;
  whtAmount?: number;
  referencedInvoiceNumber?: string;
}

export interface ExtractedTaxInvoice {
  taxInvoiceNumber?: string;
  taxInvoiceDate?: string;
  issuerNpwp?: string;
  issuerName?: string;
  buyerNpwp?: string;
  buyerName?: string;
  dppTaxBase?: number;
  vatAmount?: number;
  totalAmount?: number;
}

export interface ExtractedShopeeInvoice {
  invoiceNumberOcr?: string;
  invoiceDate?: string;
  issuerName?: string;
  issuerNpwp?: string;
  amountBeforeTax?: number;
  totalAmount?: number;
  currency?: string;
  lineItemCount?: number;
  description?: string;
}

export interface WHTRequest {
  // System fields
  id: string;
  status: Status;
  transactionType: TransactionType;
  sellerType: SellerType;
  aiSuggestion: AISuggestion;
  aiConfidence: number;

  // Common fields
  timestamp: string;
  requestorEmail: string;
  sellerCompanyName: string; // From Google Form "Nama Perusahaan"
  syncedCompanyName?: string; // Optional, from downstream sync
  invoiceNumber: string;
  invoiceUrl?: string;
  taxInvoiceUrl?: string;
  whtSlipUrl?: string;
  requestedReimbursementAmount: number;
  submissionDate: string;
  approvalStatusYN?: "Y" | "N";
  approverName?: string;
  approvalDate?: string;
  notes?: string;
  injectionStatus: InjectionStatus;
  injectionDate?: string;

  // MP-specific
  usernameShopee?: string;
  shopId?: string;
  userId?: string;

  // Food-specific
  merchantName?: string;
  merchantId?: string;
  storeId?: string;
  settleTo?: string;
  midSid?: string;

  // Document completeness
  docsComplete: {
    invoice: boolean;
    taxInvoice: boolean;
    whtSlip: boolean;
  };

  // Extracted document data
  extracted?: {
    whtSlip?: ExtractedWHTSlip;
    taxInvoice?: ExtractedTaxInvoice;
    shopeeInvoice?: ExtractedShopeeInvoice;
  };

  // Compliance fields
  eligibility?: {
    isEligible: boolean;
    reason?: string;
  };
  duplicate?: {
    isDuplicate: boolean;
  };
  exemptionPeriod?: {
    isInExemption: boolean;
  };

  // Audit log
  auditLog: AuditLogEntry[];
}

export interface AuditLogEntry {
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
}

export interface FilterState {
  status: Status | "All";
  transactionType: TransactionType | "All";
  sellerType: SellerType | "All";
  injectionStatus: InjectionStatus | "All";
  aiSuggestion?: AISuggestion | "All";
  approver: "All" | "Empty" | "Me" | string;
  dateRange: {
    start?: string;
    end?: string;
  };
  search: string;
  missingDocs: "All" | "Missing WHT Slip" | "Missing Tax Invoice" | "Missing Shopee Invoice" | "Complete";
  amountRange: "All" | "<= 1000000" | "1000001-10000000" | "> 10000000";
  sla: "All" | "> 3 days";
}
