'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EditableField } from '@/components/editable-field';
import type { WHTRequest } from '@/lib/types';

interface DocumentContextPanelProps {
  request: WHTRequest;
  activeTab: string;
  fieldIssues?: Record<string, { status: 'warn' | 'fail'; reason: string }> | null;
  onClearIssues?: () => void;
}

export function DocumentContextPanel({ request, activeTab, fieldIssues, onClearIssues }: DocumentContextPanelProps) {
  const hasIssues = fieldIssues && Object.keys(fieldIssues).length > 0;

  const handleFieldSave = (field: string) => (value: string) => {
    console.log(`[v0] Saving field ${field}:`, value);
    // TODO: API call to update field
  };

  const getFieldMetadata = (metadata: Record<string, any> | undefined, fieldName: string) => {
    const fieldMeta = metadata?.[fieldName];
    return {
      source: (fieldMeta?.source || 'ai') as 'ai' | 'user',
      updatedBy: fieldMeta?.updatedBy
    };
  };

  const getFieldIssue = (fieldName: string) => {
    if (!fieldIssues) return undefined;
    return fieldIssues[fieldName];
  };

  const renderWHTSlipFields = () => {
    const wht = request.extracted?.whtSlip;
    const fi = (name: string) => ({
      issue: getFieldIssue(name),
      dimmed: hasIssues && !getFieldIssue(name),
    });
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="WHT Slip Number (Nomor Bukti Potong)" value={wht?.whtSlipNumber} onSave={handleFieldSave('whtSlipNumber')} {...getFieldMetadata(wht?._metadata, 'whtSlipNumber')} {...fi('whtSlipNumber')} />
          <EditableField label="Tax Period / Masa Pajak (MM-YYYY)" value={wht?.taxPeriod} onSave={handleFieldSave('taxPeriod')} {...getFieldMetadata(wht?._metadata, 'taxPeriod')} {...fi('taxPeriod')} />
          <EditableField label="WHT Code" value={wht?.whtCode} onSave={handleFieldSave('whtCode')} {...getFieldMetadata(wht?._metadata, 'whtCode')} {...fi('whtCode')} />
          <EditableField label="WHT Rate (%)" value={wht?.whtRate} onSave={handleFieldSave('whtRate')} {...getFieldMetadata(wht?._metadata, 'whtRate')} {...fi('whtRate')} />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Taxpayer NPWP (Shopee)" value={wht?.taxpayerNpwp} onSave={handleFieldSave('taxpayerNpwp')} {...getFieldMetadata(wht?._metadata, 'taxpayerNpwp')} {...fi('taxpayerNpwp')} />
          <EditableField label="Taxpayer Name (Shopee)" value={wht?.taxpayerName} onSave={handleFieldSave('taxpayerName')} {...getFieldMetadata(wht?._metadata, 'taxpayerName')} {...fi('taxpayerName')} />
          <EditableField label="Collector NPWP (Seller/Merchant)" value={wht?.collectorNpwp} onSave={handleFieldSave('collectorNpwp')} {...getFieldMetadata(wht?._metadata, 'collectorNpwp')} {...fi('collectorNpwp')} />
          <EditableField label="Collector Name (Seller/Merchant)" value={wht?.collectorName} onSave={handleFieldSave('collectorName')} {...getFieldMetadata(wht?._metadata, 'collectorName')} {...fi('collectorName')} />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Tax Base / DPP" value={wht?.taxBase} isMoney onSave={handleFieldSave('taxBase')} {...getFieldMetadata(wht?._metadata, 'taxBase')} {...fi('taxBase')} />
          <EditableField label="WHT Amount (PPh23)" value={wht?.whtAmount} isMoney onSave={handleFieldSave('whtAmount')} {...getFieldMetadata(wht?._metadata, 'whtAmount')} {...fi('whtAmount')} />
          <div className="col-span-2">
            <EditableField label="Referenced Invoice Number" value={wht?.referencedInvoiceNumber} onSave={handleFieldSave('referencedInvoiceNumber')} {...getFieldMetadata(wht?._metadata, 'referencedInvoiceNumber')} {...fi('referencedInvoiceNumber')} />
          </div>
        </div>
      </div>
    );
  };

  const renderTaxInvoiceFields = () => {
    const tax = request.extracted?.taxInvoice;
    const m = tax?._metadata;
    const fi = (name: string) => ({
      issue: getFieldIssue(name),
      dimmed: hasIssues && !getFieldIssue(name),
    });
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Tax Invoice Number" value={tax?.taxInvoiceNumber} onSave={handleFieldSave('taxInvoiceNumber')} {...getFieldMetadata(m, 'taxInvoiceNumber')} {...fi('taxInvoiceNumber')} />
          <EditableField label="Tax Invoice Date" value={tax?.taxInvoiceDate} onSave={handleFieldSave('taxInvoiceDate')} {...getFieldMetadata(m, 'taxInvoiceDate')} {...fi('taxInvoiceDate')} />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Issuer NPWP" value={tax?.issuerNpwp} onSave={handleFieldSave('issuerNpwp')} {...getFieldMetadata(m, 'issuerNpwp')} {...fi('issuerNpwp')} />
          <EditableField label="Issuer Name" value={tax?.issuerName} onSave={handleFieldSave('issuerName')} {...getFieldMetadata(m, 'issuerName')} {...fi('issuerName')} />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Buyer NPWP" value={tax?.buyerNpwp} onSave={handleFieldSave('buyerNpwp')} {...getFieldMetadata(m, 'buyerNpwp')} {...fi('buyerNpwp')} />
          <EditableField label="Buyer Name" value={tax?.buyerName} onSave={handleFieldSave('buyerName')} {...getFieldMetadata(m, 'buyerName')} {...fi('buyerName')} />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="DPP (Tax Base)" value={tax?.dppTaxBase} isMoney onSave={handleFieldSave('dppTaxBase')} {...getFieldMetadata(m, 'dppTaxBase')} {...fi('dppTaxBase')} />
          <EditableField label="VAT Amount (PPN)" value={tax?.vatAmount} isMoney onSave={handleFieldSave('vatAmount')} {...getFieldMetadata(m, 'vatAmount')} {...fi('vatAmount')} />
          <div className="col-span-2">
            <EditableField label="Total Amount" value={tax?.totalAmount} isMoney onSave={handleFieldSave('totalAmount')} {...getFieldMetadata(m, 'totalAmount')} {...fi('totalAmount')} />
          </div>
        </div>
      </div>
    );
  };

  const renderShopeeInvoiceFields = () => {
    const invoice = request.extracted?.shopeeInvoice;
    const m = invoice?._metadata;
    const fi = (name: string) => ({
      issue: getFieldIssue(name),
      dimmed: hasIssues && !getFieldIssue(name),
    });
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Invoice Number (OCR)" value={invoice?.invoiceNumberOcr} onSave={handleFieldSave('invoiceNumberOcr')} {...getFieldMetadata(m, 'invoiceNumberOcr')} {...fi('invoiceNumberOcr')} />
          <EditableField label="Invoice Date" value={invoice?.invoiceDate} onSave={handleFieldSave('invoiceDate')} {...getFieldMetadata(m, 'invoiceDate')} {...fi('invoiceDate')} />
          <EditableField label="Issuer Name" value={invoice?.issuerName} onSave={handleFieldSave('issuerName')} {...getFieldMetadata(m, 'issuerName')} {...fi('issuerName')} />
          <EditableField label="Issuer NPWP" value={invoice?.issuerNpwp} onSave={handleFieldSave('issuerNpwp')} {...getFieldMetadata(m, 'issuerNpwp')} {...fi('issuerNpwp')} />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Amount Before Tax" value={invoice?.amountBeforeTax} isMoney onSave={handleFieldSave('amountBeforeTax')} {...getFieldMetadata(m, 'amountBeforeTax')} {...fi('amountBeforeTax')} />
          <EditableField label="Total Amount" value={invoice?.totalAmount} isMoney onSave={handleFieldSave('totalAmount')} {...getFieldMetadata(m, 'totalAmount')} {...fi('totalAmount')} />
          <EditableField label="Currency" value={invoice?.currency} onSave={handleFieldSave('currency')} {...getFieldMetadata(m, 'currency')} {...fi('currency')} />
          <EditableField label="Line Item Count" value={invoice?.lineItemCount} onSave={handleFieldSave('lineItemCount')} {...getFieldMetadata(m, 'lineItemCount')} {...fi('lineItemCount')} />
        </div>
        {invoice?.description && (
          <>
            <Separator />
            <EditableField label="Invoice Description" value={invoice.description} onSave={handleFieldSave('description')} {...getFieldMetadata(m, 'description')} {...fi('description')} />
          </>
        )}
      </div>
    );
  };

  const getDocumentTitle = () => {
    if (activeTab === 'wht-slip') return 'Parsed Key Fields - WHT Slip';
    if (activeTab === 'tax-invoice') return 'Parsed Key Fields - Tax Invoice';
    if (activeTab === 'shopee-invoice') return 'Parsed Key Fields - Shopee Invoice';
    return 'Parsed Key Fields';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{getDocumentTitle()}</CardTitle>
          {hasIssues && (
            <button
              onClick={onClearIssues}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear highlights
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {activeTab === 'wht-slip' && renderWHTSlipFields()}
        {activeTab === 'tax-invoice' && renderTaxInvoiceFields()}
        {activeTab === 'shopee-invoice' && renderShopeeInvoiceFields()}
      </CardContent>
    </Card>
  );
}
