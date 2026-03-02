import type { WHTRequest } from './types';

export const mockRequests: WHTRequest[] = [
  {
    id: "WHT-2026-001",
    status: "Submitted",
    transactionType: "MP Platform",
    sellerType: "Mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.92,
    timestamp: "2026-02-20T08:30:00Z",
    requestorEmail: "merchant1@mall.co.id",
    sellerCompanyName: "PT Mall Fashion Indonesia",
    invoiceNumber: "INV-MP-2026-0001",
    invoiceUrl: "https://example.com/invoice1.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice1.pdf",
    whtSlipUrl: "https://example.com/wht-slip1.pdf",
    requestedReimbursementAmount: 5000000,
    submissionDate: "2026-02-20",
    injectionStatus: "Not Started",
    usernameShopee: "fashionstore_jkt",
    shopId: "12345678",
    userId: "987654321",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    extracted: {
      whtSlip: {
        whtSlipNumber: "BP-2301-000123",
        taxPeriod: "January 2026",
        whtSlipStatus: "Normal",
        taxpayerNpwp: "01.234.567.8-901.000",
        taxpayerName: "PT Mall Fashion Indonesia",
        whtCode: "23-100-01",
        dpp: 250000000,
        whtRate: 2,
        whtAmount: 5000000,
        sellerMerchantNpwp: "02.345.678.9-012.000",
        sellerMerchantName: "PT Shopee Indonesia",
        referencedInvoiceNumber: "010.000-26.00000123",
        _metadata: {
          taxpayerName: {
            source: 'user',
            updatedBy: 'reviewer@company.com',
            updatedAt: '2026-02-20T09:15:00Z'
          },
          sellerMerchantNpwp: {
            source: 'user',
            updatedBy: 'admin@company.com',
            updatedAt: '2026-02-20T10:30:00Z'
          }
        }
      },
      taxInvoice: {
        taxInvoiceNumber: "010.000-26.00000123",
        issuerName: "PT Mall Fashion Indonesia",
        issuerNpwp: "01.234.567.8-901.000",
        sellerMerchantNpwp: "02.345.678.9-012.000",
        sellerMerchantName: "PT Shopee Indonesia",
        totalAmountInclTax: 277500000,
        dpp: 250000000,
        vatAmount: 27500000,
        _metadata: {
          issuerName: {
            source: 'user',
            updatedBy: 'tax.admin@company.com',
            updatedAt: '2026-02-20T11:00:00Z'
          }
        }
      },
      shopeeInvoice: {
        issuerName: "PT Shopee Indonesia",
        issuerNpwp: "03.456.789.0-123.000",
        sellerMerchantName: "PT Mall Fashion Indonesia",
        sellerMerchantUsername: "fashionstore_jkt",
        commercialInvoiceNumber: "INV-MP-2026-0001",
        totalAmountInclTax: 250000000
      }
    },
    auditLog: [
      {
        timestamp: "2026-02-20T08:30:00Z",
        actor: "merchant1@mall.co.id",
        action: "Submitted request"
      }
    ]
  },
  {
    id: "WHT-2026-002",
    status: "Pending Review",
    transactionType: "Food Platform Invoice",
    sellerType: "Merchant",
    aiSuggestion: "Pending Review",
    aiConfidence: 0.65,
    timestamp: "2026-02-19T14:20:00Z",
    requestorEmail: "resto@food.co.id",
    sellerCompanyName: "CV Kuliner Nusantara",
    invoiceNumber: "INV-FOOD-2026-0045",
    invoiceUrl: "https://example.com/invoice2.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice2.pdf",
    requestedReimbursementAmount: 850000,
    submissionDate: "2026-02-19",
    injectionStatus: "Not Started",
    merchantName: "Nasi Goreng Spesial",
    merchantId: "MER-45678",
    storeId: "STORE-12345",
    settleTo: "MID",
    midSid: "MID-123456",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: false },
    auditLog: [
      {
        timestamp: "2026-02-19T14:20:00Z",
        actor: "resto@food.co.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-19T15:00:00Z",
        actor: "tax.reviewer@company.com",
        action: "Moved to Pending Review",
        details: "Missing WHT Slip document"
      }
    ]
  },
  {
    id: "WHT-2026-003",
    status: "Approved",
    transactionType: "MP Platform",
    sellerType: "Non-mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.88,
    timestamp: "2026-02-18T10:15:00Z",
    requestorEmail: "seller@ecommerce.id",
    sellerCompanyName: "UD Elektronik Jaya",
    invoiceNumber: "INV-MP-2026-0123",
    invoiceUrl: "https://example.com/invoice3.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice3.pdf",
    whtSlipUrl: "https://example.com/wht-slip3.pdf",
    requestedReimbursementAmount: 12500000,
    submissionDate: "2026-02-18",
    approvalStatusYN: "Y",
    approverName: "tax.manager@company.com",
    approvalDate: "2026-02-19",
    injectionStatus: "Not Started",
    usernameShopee: "elektronik_jaya",
    shopId: "23456789",
    userId: "876543210",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-18T10:15:00Z",
        actor: "seller@ecommerce.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-19T09:30:00Z",
        actor: "tax.manager@company.com",
        action: "Approved request"
      }
    ]
  },
  {
    id: "WHT-2026-004",
    status: "Rejected",
    transactionType: "Food Platform Invoice",
    sellerType: "Merchant",
    aiSuggestion: "Reject",
    aiConfidence: 0.78,
    timestamp: "2026-02-17T16:45:00Z",
    requestorEmail: "cafe@merchant.id",
    sellerCompanyName: "PT Kopi Kita Bersama",
    invoiceNumber: "INV-FOOD-2026-0078",
    invoiceUrl: "https://example.com/invoice4.pdf",
    requestedReimbursementAmount: 450000,
    submissionDate: "2026-02-17",
    approvalStatusYN: "N",
    approverName: "tax.reviewer@company.com",
    approvalDate: "2026-02-18",
    notes: "Invoice number mismatch with tax records",
    injectionStatus: "Not Started",
    merchantName: "Kopi Kenangan Surabaya",
    merchantId: "MER-78901",
    storeId: "STORE-67890",
    settleTo: "SID",
    midSid: "SID-789012",
    docsComplete: { invoice: true, taxInvoice: false, whtSlip: false },
    auditLog: [
      {
        timestamp: "2026-02-17T16:45:00Z",
        actor: "cafe@merchant.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-18T11:20:00Z",
        actor: "tax.reviewer@company.com",
        action: "Rejected request",
        details: "Invoice number mismatch; Missing tax documents"
      }
    ]
  },
  {
    id: "WHT-2026-005",
    status: "Approved",
    transactionType: "SVS Prepaid Invoice",
    sellerType: "Mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.95,
    timestamp: "2026-02-16T09:00:00Z",
    requestorEmail: "admin@svs-partner.com",
    sellerCompanyName: "PT Service Provider Indonesia",
    invoiceNumber: "INV-SVS-2026-0012",
    invoiceUrl: "https://example.com/invoice5.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice5.pdf",
    whtSlipUrl: "https://example.com/wht-slip5.pdf",
    requestedReimbursementAmount: 25000000,
    submissionDate: "2026-02-16",
    approvalStatusYN: "Y",
    approverName: "ops.manager@company.com",
    approvalDate: "2026-02-17",
    injectionStatus: "Done",
    injectionDate: "2026-02-18",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-16T09:00:00Z",
        actor: "admin@svs-partner.com",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-17T10:00:00Z",
        actor: "ops.manager@company.com",
        action: "Approved request"
      },
      {
        timestamp: "2026-02-18T14:30:00Z",
        actor: "ops.injection@company.com",
        action: "Injection completed"
      }
    ]
  },
  {
    id: "WHT-2026-006",
    status: "Submitted",
    transactionType: "AMS PPS",
    sellerType: "Non-mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.85,
    timestamp: "2026-02-23T07:30:00Z",
    requestorEmail: "ads@marketing.co.id",
    sellerCompanyName: "PT Digital Marketing Solutions",
    invoiceNumber: "INV-AMS-2026-0034",
    invoiceUrl: "https://example.com/invoice6.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice6.pdf",
    whtSlipUrl: "https://example.com/wht-slip6.pdf",
    requestedReimbursementAmount: 8500000,
    submissionDate: "2026-02-23",
    injectionStatus: "Not Started",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-23T07:30:00Z",
        actor: "ads@marketing.co.id",
        action: "Submitted request"
      }
    ]
  },
  {
    id: "WHT-2026-007",
    status: "Approved",
    transactionType: "MP Platform",
    sellerType: "Mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.90,
    timestamp: "2026-02-15T11:20:00Z",
    requestorEmail: "beauty@cosmetics.id",
    sellerCompanyName: "CV Kecantikan Nusantara",
    invoiceNumber: "INV-MP-2026-0156",
    invoiceUrl: "https://example.com/invoice7.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice7.pdf",
    whtSlipUrl: "https://example.com/wht-slip7.pdf",
    requestedReimbursementAmount: 3200000,
    submissionDate: "2026-02-15",
    approvalStatusYN: "Y",
    approverName: "tax.lead@company.com",
    approvalDate: "2026-02-16",
    injectionStatus: "Failed",
    usernameShopee: "beauty_store_id",
    shopId: "34567890",
    userId: "765432109",
    notes: "Injection retry scheduled",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-15T11:20:00Z",
        actor: "beauty@cosmetics.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-16T13:00:00Z",
        actor: "tax.lead@company.com",
        action: "Approved request"
      },
      {
        timestamp: "2026-02-17T16:00:00Z",
        actor: "ops.injection@company.com",
        action: "Injection failed",
        details: "System error - retry scheduled"
      }
    ]
  },
  {
    id: "WHT-2026-008",
    status: "Pending Review",
    transactionType: "Food Platform Invoice",
    sellerType: "Merchant",
    aiSuggestion: "Pending Review",
    aiConfidence: 0.58,
    timestamp: "2026-02-22T13:45:00Z",
    requestorEmail: "bakery@food.id",
    sellerCompanyName: "UD Roti Sedap Malam",
    invoiceNumber: "INV-FOOD-2026-0089",
    invoiceUrl: "https://example.com/invoice8.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice8.pdf",
    requestedReimbursementAmount: 1200000,
    submissionDate: "2026-02-22",
    injectionStatus: "Not Started",
    merchantName: "Bakery Enak",
    merchantId: "MER-34567",
    storeId: "STORE-23456",
    settleTo: "MID",
    midSid: "MID-345678",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: false },
    auditLog: [
      {
        timestamp: "2026-02-22T13:45:00Z",
        actor: "bakery@food.id",
        action: "Submitted request"
      }
    ]
  },
  {
    id: "WHT-2026-009",
    status: "Submitted",
    transactionType: "FBS",
    sellerType: "Non-mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.87,
    timestamp: "2026-02-21T15:10:00Z",
    requestorEmail: "warehouse@logistics.id",
    sellerCompanyName: "PT Logistik Nusantara",
    invoiceNumber: "INV-FBS-2026-0023",
    invoiceUrl: "https://example.com/invoice9.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice9.pdf",
    whtSlipUrl: "https://example.com/wht-slip9.pdf",
    requestedReimbursementAmount: 15000000,
    submissionDate: "2026-02-21",
    injectionStatus: "Not Started",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-21T15:10:00Z",
        actor: "warehouse@logistics.id",
        action: "Submitted request"
      }
    ]
  },
  {
    id: "WHT-2026-010",
    status: "Approved",
    transactionType: "AMS PPP",
    sellerType: "Mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.93,
    timestamp: "2026-02-14T08:00:00Z",
    requestorEmail: "partner@advertising.com",
    sellerCompanyName: "PT Media Partner Indonesia",
    invoiceNumber: "INV-AMS-2026-0067",
    invoiceUrl: "https://example.com/invoice10.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice10.pdf",
    whtSlipUrl: "https://example.com/wht-slip10.pdf",
    requestedReimbursementAmount: 18000000,
    submissionDate: "2026-02-14",
    approvalStatusYN: "Y",
    approverName: "tax.manager@company.com",
    approvalDate: "2026-02-15",
    injectionStatus: "Not Started",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-14T08:00:00Z",
        actor: "partner@advertising.com",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-15T11:30:00Z",
        actor: "tax.manager@company.com",
        action: "Approved request"
      }
    ]
  },
  {
    id: "WHT-2026-011",
    status: "Submitted",
    transactionType: "MP Platform",
    sellerType: "Non-mall",
    aiSuggestion: "Pending Review",
    aiConfidence: 0.62,
    timestamp: "2026-02-13T12:30:00Z",
    requestorEmail: "gadget@tech.id",
    sellerCompanyName: "CV Teknologi Masa Depan",
    invoiceNumber: "INV-MP-2026-0198",
    taxInvoiceUrl: "https://example.com/tax-invoice11.pdf",
    whtSlipUrl: "https://example.com/wht-slip11.pdf",
    requestedReimbursementAmount: 7200000,
    submissionDate: "2026-02-13",
    injectionStatus: "Not Started",
    usernameShopee: "gadget_store",
    shopId: "45678901",
    userId: "654321098",
    docsComplete: { invoice: false, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-13T12:30:00Z",
        actor: "gadget@tech.id",
        action: "Submitted request"
      }
    ]
  },
  {
    id: "WHT-2026-012",
    status: "Approved",
    transactionType: "Food Platform Invoice",
    sellerType: "Merchant",
    aiSuggestion: "Approve",
    aiConfidence: 0.91,
    timestamp: "2026-02-12T09:15:00Z",
    requestorEmail: "restaurant@dining.id",
    sellerCompanyName: "PT Restoran Indonesia",
    invoiceNumber: "INV-FOOD-2026-0112",
    invoiceUrl: "https://example.com/invoice12.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice12.pdf",
    whtSlipUrl: "https://example.com/wht-slip12.pdf",
    requestedReimbursementAmount: 4500000,
    submissionDate: "2026-02-12",
    approvalStatusYN: "Y",
    approverName: "ops.manager@company.com",
    approvalDate: "2026-02-13",
    injectionStatus: "Not Started",
    merchantName: "Restoran Padang Sedap",
    merchantId: "MER-56789",
    storeId: "STORE-34567",
    settleTo: "MID",
    midSid: "MID-567890",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-12T09:15:00Z",
        actor: "restaurant@dining.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-13T10:45:00Z",
        actor: "ops.manager@company.com",
        action: "Approved request"
      }
    ]
  },
  {
    id: "WHT-2026-013",
    status: "Rejected",
    transactionType: "MP Platform",
    sellerType: "Mall",
    aiSuggestion: "Reject",
    aiConfidence: 0.82,
    timestamp: "2026-02-11T14:00:00Z",
    requestorEmail: "fashion@outlet.id",
    sellerCompanyName: "PT Fashion Outlet",
    invoiceNumber: "INV-MP-2026-0234",
    invoiceUrl: "https://example.com/invoice13.pdf",
    requestedReimbursementAmount: 950000,
    submissionDate: "2026-02-11",
    approvalStatusYN: "N",
    approverName: "tax.reviewer@company.com",
    approvalDate: "2026-02-12",
    notes: "Incomplete documentation",
    injectionStatus: "Not Started",
    usernameShopee: "fashion_outlet_jkt",
    shopId: "56789012",
    userId: "543210987",
    docsComplete: { invoice: true, taxInvoice: false, whtSlip: false },
    auditLog: [
      {
        timestamp: "2026-02-11T14:00:00Z",
        actor: "fashion@outlet.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-12T15:30:00Z",
        actor: "tax.reviewer@company.com",
        action: "Rejected request",
        details: "Missing tax invoice and WHT slip"
      }
    ]
  },
  {
    id: "WHT-2026-014",
    status: "Submitted",
    transactionType: "SVS Prepaid Invoice",
    sellerType: "Non-mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.89,
    timestamp: "2026-02-10T10:30:00Z",
    requestorEmail: "service@provider.id",
    sellerCompanyName: "CV Service Excellence",
    invoiceNumber: "INV-SVS-2026-0045",
    invoiceUrl: "https://example.com/invoice14.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice14.pdf",
    whtSlipUrl: "https://example.com/wht-slip14.pdf",
    requestedReimbursementAmount: 11000000,
    submissionDate: "2026-02-10",
    injectionStatus: "Not Started",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-10T10:30:00Z",
        actor: "service@provider.id",
        action: "Submitted request"
      }
    ]
  },
  {
    id: "WHT-2026-015",
    status: "Pending Review",
    transactionType: "Food Platform Invoice",
    sellerType: "Merchant",
    aiSuggestion: "Pending Review",
    aiConfidence: 0.55,
    timestamp: "2026-02-09T16:20:00Z",
    requestorEmail: "fastfood@quick.id",
    sellerCompanyName: "UD Quick Bite",
    invoiceNumber: "INV-FOOD-2026-0134",
    invoiceUrl: "https://example.com/invoice15.pdf",
    requestedReimbursementAmount: 680000,
    submissionDate: "2026-02-09",
    injectionStatus: "Not Started",
    merchantName: "Quick Bite Express",
    merchantId: "MER-67890",
    storeId: "STORE-45678",
    settleTo: "SID",
    midSid: "SID-678901",
    docsComplete: { invoice: true, taxInvoice: false, whtSlip: false },
    auditLog: [
      {
        timestamp: "2026-02-09T16:20:00Z",
        actor: "fastfood@quick.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-10T09:00:00Z",
        actor: "tax.reviewer@company.com",
        action: "Moved to Pending Review",
        details: "Requires additional documentation"
      }
    ]
  },
  {
    id: "WHT-2026-016",
    status: "Approved",
    transactionType: "AMS PPS",
    sellerType: "Mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.94,
    timestamp: "2026-02-08T08:45:00Z",
    requestorEmail: "digital@agency.id",
    sellerCompanyName: "PT Digital Agency Pro",
    invoiceNumber: "INV-AMS-2026-0089",
    invoiceUrl: "https://example.com/invoice16.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice16.pdf",
    whtSlipUrl: "https://example.com/wht-slip16.pdf",
    requestedReimbursementAmount: 22000000,
    submissionDate: "2026-02-08",
    approvalStatusYN: "Y",
    approverName: "tax.lead@company.com",
    approvalDate: "2026-02-09",
    injectionStatus: "Done",
    injectionDate: "2026-02-10",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-08T08:45:00Z",
        actor: "digital@agency.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-09T14:15:00Z",
        actor: "tax.lead@company.com",
        action: "Approved request"
      },
      {
        timestamp: "2026-02-10T11:00:00Z",
        actor: "ops.injection@company.com",
        action: "Injection completed"
      }
    ]
  },
  {
    id: "WHT-2026-017",
    status: "Submitted",
    transactionType: "MP Platform",
    sellerType: "Non-mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.86,
    timestamp: "2026-02-07T11:00:00Z",
    requestorEmail: "books@store.id",
    sellerCompanyName: "CV Toko Buku Cerdas",
    invoiceNumber: "INV-MP-2026-0267",
    invoiceUrl: "https://example.com/invoice17.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice17.pdf",
    whtSlipUrl: "https://example.com/wht-slip17.pdf",
    requestedReimbursementAmount: 2800000,
    submissionDate: "2026-02-07",
    injectionStatus: "Not Started",
    usernameShopee: "bookstore_online",
    shopId: "67890123",
    userId: "432109876",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-07T11:00:00Z",
        actor: "books@store.id",
        action: "Submitted request"
      }
    ]
  },
  {
    id: "WHT-2026-018",
    status: "Approved",
    transactionType: "FBS",
    sellerType: "Mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.96,
    timestamp: "2026-02-06T13:30:00Z",
    requestorEmail: "fulfillment@partner.id",
    sellerCompanyName: "PT Fulfillment Service",
    invoiceNumber: "INV-FBS-2026-0034",
    invoiceUrl: "https://example.com/invoice18.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice18.pdf",
    whtSlipUrl: "https://example.com/wht-slip18.pdf",
    requestedReimbursementAmount: 28000000,
    submissionDate: "2026-02-06",
    approvalStatusYN: "Y",
    approverName: "ops.director@company.com",
    approvalDate: "2026-02-07",
    injectionStatus: "Not Started",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-06T13:30:00Z",
        actor: "fulfillment@partner.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-07T09:00:00Z",
        actor: "ops.director@company.com",
        action: "Approved request"
      }
    ]
  },
  {
    id: "WHT-2026-019",
    status: "Pending Review",
    transactionType: "Food Platform Invoice",
    sellerType: "Merchant",
    aiSuggestion: "Approve",
    aiConfidence: 0.75,
    timestamp: "2026-02-05T15:45:00Z",
    requestorEmail: "juice@bar.id",
    sellerCompanyName: "CV Jus Segar",
    invoiceNumber: "INV-FOOD-2026-0156",
    invoiceUrl: "https://example.com/invoice19.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice19.pdf",
    whtSlipUrl: "https://example.com/wht-slip19.pdf",
    requestedReimbursementAmount: 1350000,
    submissionDate: "2026-02-05",
    injectionStatus: "Not Started",
    merchantName: "Juice Bar Fresh",
    merchantId: "MER-78901",
    storeId: "STORE-56789",
    settleTo: "MID",
    midSid: "MID-789012",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-05T15:45:00Z",
        actor: "juice@bar.id",
        action: "Submitted request"
      },
      {
        timestamp: "2026-02-06T08:30:00Z",
        actor: "tax.reviewer@company.com",
        action: "Moved to Pending Review",
        details: "Amount verification needed"
      }
    ]
  },
  {
    id: "WHT-2026-020",
    status: "Submitted",
    transactionType: "AMS PPP",
    sellerType: "Non-mall",
    aiSuggestion: "Approve",
    aiConfidence: 0.88,
    timestamp: "2026-02-04T09:20:00Z",
    requestorEmail: "marketing@promo.id",
    sellerCompanyName: "PT Promo Digital",
    invoiceNumber: "INV-AMS-2026-0112",
    invoiceUrl: "https://example.com/invoice20.pdf",
    taxInvoiceUrl: "https://example.com/tax-invoice20.pdf",
    whtSlipUrl: "https://example.com/wht-slip20.pdf",
    requestedReimbursementAmount: 16500000,
    submissionDate: "2026-02-04",
    injectionStatus: "Not Started",
    docsComplete: { invoice: true, taxInvoice: true, whtSlip: true },
    auditLog: [
      {
        timestamp: "2026-02-04T09:20:00Z",
        actor: "marketing@promo.id",
        action: "Submitted request"
      }
    ]
  }
];
