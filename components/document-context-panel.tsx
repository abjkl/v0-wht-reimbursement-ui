'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { WHTRequest } from '@/lib/types';
import { formatCurrency } from '@/lib/filter-utils';

interface DocumentContextPanelProps {
  request: WHTRequest;
  activeTab: string;
}

interface FieldRowProps {
  label: string;
  value: string | number | undefined | null;
  source: string;
  isMoney?: boolean;
}

function FieldRow({ label, value, source, isMoney }: FieldRowProps) {
  const displayValue = value 
    ? (isMoney && typeof value === 'number' ? formatCurrency(value) : String(value))
    : '—';
  
  const isEmpty = !value;

  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Source: {source}</p>
      </div>
      <div className="flex flex-col items-end">
        <p className={`text-sm ${isEmpty ? 'text-muted-foreground' : 'font-mono'}`}>
          {displayValue}
        </p>
        {isEmpty && (
          <p className="text-xs text-muted-foreground">Not extracted</p>
        )}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <>
      <Separator className="my-3" />
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </h4>
    </>
  );
}

export function DocumentContextPanel({ request, activeTab }: DocumentContextPanelProps) {
  const { extracted } = request;

  // WHT Slip Tab Content
  if (activeTab === 'wht-slip') {
    const whtData = extracted?.whtSlip;

    return (
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-3">
          <CardTitle className="text-base font-semibold">Parsed Key Fields</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Slip Summary */}
          <SectionHeader title="Slip Summary" />
          <FieldRow
            label="WHT Slip Number (Nomor Bukti Potong)"
            value={whtData?.slipNumber}
            source="WHT Slip OCR"
          />
          <FieldRow
            label="Tax Period / Masa Pajak (MM-YYYY)"
            value={whtData?.taxPeriod}
            source="WHT Slip OCR"
          />
          <FieldRow
            label="WHT Code"
            value={whtData?.whtCode}
            source="WHT Slip OCR"
          />
          <FieldRow
            label="WHT Rate (%)"
            value={whtData?.whtRate}
            source="WHT Slip OCR"
          />

          {/* Parties */}
          <SectionHeader title="Parties" />
          <FieldRow
            label="Taxpayer NPWP (Shopee)"
            value={whtData?.taxpayerNpwp}
            source="WHT Slip OCR"
          />
          <FieldRow
            label="Taxpayer Name (Shopee)"
            value={whtData?.taxpayerName}
            source="WHT Slip OCR"
          />
          <FieldRow
            label="Collector NPWP (Seller/Merchant)"
            value={whtData?.collectorNpwp}
            source="WHT Slip OCR"
          />
          <FieldRow
            label="Collector Name (Seller/Merchant)"
            value={whtData?.collectorName}
            source="WHT Slip OCR"
          />

          {/* Tax Detail */}
          <SectionHeader title="Tax Detail" />
          <FieldRow
            label="Tax Base / DPP"
            value={whtData?.taxBase}
            source="WHT Slip OCR"
            isMoney
          />
          <FieldRow
            label="WHT Amount (PPh23)"
            value={whtData?.whtAmount}
            source="WHT Slip OCR"
            isMoney
          />

          {/* Invoice Reference */}
          <SectionHeader title="Invoice Reference" />
          <FieldRow
            label="Referenced Invoice Number (B9)"
            value={whtData?.referencedInvoiceNumber}
            source="WHT Slip OCR"
          />
        </CardContent>
      </Card>
    );
  }

  // Tax Invoice Tab Content
  if (activeTab === 'tax-invoice') {
    const taxData = extracted?.taxInvoice;

    return (
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-3">
          <CardTitle className="text-base font-semibold">Parsed Key Fields</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Tax Invoice Info */}
          <SectionHeader title="Tax Invoice Info" />
          <FieldRow
            label="Tax Invoice Number (Nomor Faktur Pajak)"
            value={taxData?.taxInvoiceNumber}
            source="Tax Invoice OCR"
          />
          <FieldRow
            label="Tax Invoice Date"
            value={taxData?.taxInvoiceDate}
            source="Tax Invoice OCR"
          />

          {/* Issuer (Shopee Entity) */}
          <SectionHeader title="Issuer (Shopee Entity)" />
          <FieldRow
            label="Issuer NPWP"
            value={taxData?.issuerNpwp}
            source="Tax Invoice OCR"
          />
          <FieldRow
            label="Issuer Name"
            value={taxData?.issuerName}
            source="Tax Invoice OCR"
          />

          {/* Buyer (Seller/Merchant) */}
          <SectionHeader title="Buyer (Seller/Merchant)" />
          <FieldRow
            label="Buyer NPWP"
            value={taxData?.buyerNpwp}
            source="Tax Invoice OCR"
          />
          <FieldRow
            label="Buyer Name"
            value={taxData?.buyerName}
            source="Tax Invoice OCR"
          />

          {/* Amounts */}
          <SectionHeader title="Amounts" />
          <FieldRow
            label="DPP / Tax Base (Harga Jual/Penggantian)"
            value={taxData?.dppTaxBase}
            source="Tax Invoice OCR"
            isMoney
          />
          <FieldRow
            label="VAT / PPN"
            value={taxData?.vatAmount}
            source="Tax Invoice OCR"
            isMoney
          />
          <FieldRow
            label="Total Amount"
            value={taxData?.totalAmount}
            source="Tax Invoice OCR"
            isMoney
          />
        </CardContent>
      </Card>
    );
  }

  // Shopee Invoice Tab Content
  if (activeTab === 'shopee-invoice') {
    const shopeeData = extracted?.shopeeInvoice;

    return (
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-3">
          <CardTitle className="text-base font-semibold">Parsed Key Fields</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Commercial Invoice Info */}
          <SectionHeader title="Commercial Invoice Info" />
          <FieldRow
            label="Seller Input Invoice Number"
            value={request.invoiceNumber}
            source="Seller Input"
          />
          <FieldRow
            label="OCR Extracted Invoice Number"
            value={shopeeData?.invoiceNumberOcr}
            source="Shopee Invoice OCR"
          />
          <FieldRow
            label="Invoice Date"
            value={shopeeData?.invoiceDate}
            source="Shopee Invoice OCR"
          />

          {/* Issuer */}
          <SectionHeader title="Issuer" />
          <FieldRow
            label="Issuer Name"
            value={shopeeData?.issuerName}
            source="Shopee Invoice OCR"
          />

          {/* Amounts */}
          <SectionHeader title="Amounts" />
          <FieldRow
            label="Amount Before Tax"
            value={shopeeData?.amountBeforeTax}
            source="Shopee Invoice OCR"
            isMoney
          />
          <FieldRow
            label="Total Amount"
            value={shopeeData?.totalAmount}
            source="Shopee Invoice OCR"
            isMoney
          />
          <FieldRow
            label="Currency"
            value={shopeeData?.currency || 'IDR'}
            source="Shopee Invoice OCR"
          />
        </CardContent>
      </Card>
    );
  }

  // Default fallback
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-3">
        <CardTitle className="text-base font-semibold">Parsed Key Fields</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">Select a document to view parsed fields</p>
      </CardContent>
    </Card>
  );
}
