'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil, Check, X } from 'lucide-react';
import type { WHTRequest } from '@/lib/types';
import { formatCurrency } from '@/lib/filter-utils';

interface DocumentContextPanelProps {
  request: WHTRequest;
  activeTab: string;
}

interface EditableFieldRowProps {
  label: string;
  value: string | number | undefined | null;
  isMoney?: boolean;
  onSave?: (newValue: string) => void;
}

function EditableFieldRow({ label, value, isMoney, onSave }: EditableFieldRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const displayValue = value 
    ? (isMoney && typeof value === 'number' ? formatCurrency(value) : String(value))
    : '—';
  
  const isEmpty = !value;

  const handleEdit = () => {
    setEditValue(value ? String(value) : '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  return (
    <div className="group flex items-center justify-between gap-3 py-2 hover:bg-muted/30 rounded px-2 -mx-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-7 w-40 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={handleSave}
            >
              <Check className="h-3.5 w-3.5 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={handleCancel}
            >
              <X className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </>
        ) : (
          <>
            <p className={`text-sm ${isEmpty ? 'text-muted-foreground' : 'font-mono'}`}>
              {displayValue}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </>
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

  const handleFieldSave = (fieldPath: string, newValue: string) => {
    console.log('[v0] Saving field:', fieldPath, newValue);
    // TODO: Implement actual save logic via API
  };

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
          <EditableFieldRow
            label="WHT Slip Number (Nomor Bukti Potong)"
            value={whtData?.slipNumber}
            onSave={(val) => handleFieldSave('whtSlip.slipNumber', val)}
          />
          <EditableFieldRow
            label="Tax Period / Masa Pajak (MM-YYYY)"
            value={whtData?.taxPeriod}
            onSave={(val) => handleFieldSave('whtSlip.taxPeriod', val)}
          />
          <EditableFieldRow
            label="WHT Code"
            value={whtData?.whtCode}
            onSave={(val) => handleFieldSave('whtSlip.whtCode', val)}
          />
          <EditableFieldRow
            label="WHT Rate (%)"
            value={whtData?.whtRate}
            onSave={(val) => handleFieldSave('whtSlip.whtRate', val)}
          />

          {/* Parties */}
          <SectionHeader title="Parties" />
          <EditableFieldRow
            label="Taxpayer NPWP (Shopee)"
            value={whtData?.taxpayerNpwp}
            onSave={(val) => handleFieldSave('whtSlip.taxpayerNpwp', val)}
          />
          <EditableFieldRow
            label="Taxpayer Name (Shopee)"
            value={whtData?.taxpayerName}
            onSave={(val) => handleFieldSave('whtSlip.taxpayerName', val)}
          />
          <EditableFieldRow
            label="Collector NPWP (Seller/Merchant)"
            value={whtData?.collectorNpwp}
            onSave={(val) => handleFieldSave('whtSlip.collectorNpwp', val)}
          />
          <EditableFieldRow
            label="Collector Name (Seller/Merchant)"
            value={whtData?.collectorName}
            onSave={(val) => handleFieldSave('whtSlip.collectorName', val)}
          />

          {/* Tax Detail */}
          <SectionHeader title="Tax Detail" />
          <EditableFieldRow
            label="Tax Base / DPP"
            value={whtData?.taxBase}
            onSave={(val) => handleFieldSave('whtSlip.taxBase', val)}
            isMoney
          />
          <EditableFieldRow
            label="WHT Amount (PPh23)"
            value={whtData?.whtAmount}
            onSave={(val) => handleFieldSave('whtSlip.whtAmount', val)}
            isMoney
          />

          {/* Invoice Reference */}
          <SectionHeader title="Invoice Reference" />
          <EditableFieldRow
            label="Referenced Invoice Number (B9)"
            value={whtData?.referencedInvoiceNumber}
            onSave={(val) => handleFieldSave('whtSlip.referencedInvoiceNumber', val)}
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
          <EditableFieldRow
            label="Tax Invoice Number (Nomor Faktur Pajak)"
            value={taxData?.taxInvoiceNumber}
            onSave={(val) => handleFieldSave('taxInvoice.taxInvoiceNumber', val)}
          />
          <EditableFieldRow
            label="Tax Invoice Date"
            value={taxData?.taxInvoiceDate}
            onSave={(val) => handleFieldSave('taxInvoice.taxInvoiceDate', val)}
          />

          {/* Issuer (Shopee Entity) */}
          <SectionHeader title="Issuer (Shopee Entity)" />
          <EditableFieldRow
            label="Issuer NPWP"
            value={taxData?.issuerNpwp}
            onSave={(val) => handleFieldSave('taxInvoice.issuerNpwp', val)}
          />
          <EditableFieldRow
            label="Issuer Name"
            value={taxData?.issuerName}
            onSave={(val) => handleFieldSave('taxInvoice.issuerName', val)}
          />

          {/* Buyer (Seller/Merchant) */}
          <SectionHeader title="Buyer (Seller/Merchant)" />
          <EditableFieldRow
            label="Buyer NPWP"
            value={taxData?.buyerNpwp}
            onSave={(val) => handleFieldSave('taxInvoice.buyerNpwp', val)}
          />
          <EditableFieldRow
            label="Buyer Name"
            value={taxData?.buyerName}
            onSave={(val) => handleFieldSave('taxInvoice.buyerName', val)}
          />

          {/* Amounts */}
          <SectionHeader title="Amounts" />
          <EditableFieldRow
            label="DPP / Tax Base (Harga Jual/Penggantian)"
            value={taxData?.dppTaxBase}
            onSave={(val) => handleFieldSave('taxInvoice.dppTaxBase', val)}
            isMoney
          />
          <EditableFieldRow
            label="VAT / PPN"
            value={taxData?.vatAmount}
            onSave={(val) => handleFieldSave('taxInvoice.vatAmount', val)}
            isMoney
          />
          <EditableFieldRow
            label="Total Amount"
            value={taxData?.totalAmount}
            onSave={(val) => handleFieldSave('taxInvoice.totalAmount', val)}
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
          <EditableFieldRow
            label="Seller Input Invoice Number"
            value={request.invoiceNumber}
            onSave={(val) => handleFieldSave('invoiceNumber', val)}
          />
          <EditableFieldRow
            label="OCR Extracted Invoice Number"
            value={shopeeData?.invoiceNumberOcr}
            onSave={(val) => handleFieldSave('shopeeInvoice.invoiceNumberOcr', val)}
          />
          <EditableFieldRow
            label="Invoice Date"
            value={shopeeData?.invoiceDate}
            onSave={(val) => handleFieldSave('shopeeInvoice.invoiceDate', val)}
          />

          {/* Issuer */}
          <SectionHeader title="Issuer" />
          <EditableFieldRow
            label="Issuer Name"
            value={shopeeData?.issuerName}
            onSave={(val) => handleFieldSave('shopeeInvoice.issuerName', val)}
          />

          {/* Amounts */}
          <SectionHeader title="Amounts" />
          <EditableFieldRow
            label="Amount Before Tax"
            value={shopeeData?.amountBeforeTax}
            onSave={(val) => handleFieldSave('shopeeInvoice.amountBeforeTax', val)}
            isMoney
          />
          <EditableFieldRow
            label="Total Amount"
            value={shopeeData?.totalAmount}
            onSave={(val) => handleFieldSave('shopeeInvoice.totalAmount', val)}
            isMoney
          />
          <EditableFieldRow
            label="Currency"
            value={shopeeData?.currency || 'IDR'}
            onSave={(val) => handleFieldSave('shopeeInvoice.currency', val)}
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
