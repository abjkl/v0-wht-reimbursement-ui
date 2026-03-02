'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EditableField } from '@/components/editable-field';
import type { WHTRequest } from '@/lib/types';

interface DocumentContextPanelProps {
  request: WHTRequest;
  fieldIssues?: Record<string, { status: 'warn' | 'fail'; reason: string }> | null;
  onClearIssues?: () => void;
}

export function DocumentContextPanel({ request, fieldIssues, onClearIssues }: DocumentContextPanelProps) {
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
          <EditableField label="WHT Slip Number" value={wht?.whtSlipNumber} onSave={handleFieldSave('whtSlipNumber')} {...getFieldMetadata(wht?._metadata, 'whtSlipNumber')} {...fi('whtSlipNumber')} />
          <EditableField label="Tax Period" value={wht?.taxPeriod} onSave={handleFieldSave('taxPeriod')} {...getFieldMetadata(wht?._metadata, 'taxPeriod')} {...fi('taxPeriod')} />
          <EditableField label="Status" value={wht?.whtSlipStatus} onSave={handleFieldSave('whtSlipStatus')} {...getFieldMetadata(wht?._metadata, 'whtSlipStatus')} {...fi('whtSlipStatus')} />
          <EditableField label="Taxpayer NPWP" value={wht?.taxpayerNpwp} onSave={handleFieldSave('taxpayerNpwp')} {...getFieldMetadata(wht?._metadata, 'taxpayerNpwp')} {...fi('taxpayerNpwp')} />
          <EditableField label="Taxpayer Name" value={wht?.taxpayerName} onSave={handleFieldSave('taxpayerName')} {...getFieldMetadata(wht?._metadata, 'taxpayerName')} {...fi('taxpayerName')} />
          <EditableField label="WHT Code" value={wht?.whtCode} onSave={handleFieldSave('whtCode')} {...getFieldMetadata(wht?._metadata, 'whtCode')} {...fi('whtCode')} />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="DPP" value={wht?.dpp} isMoney onSave={handleFieldSave('dpp')} {...getFieldMetadata(wht?._metadata, 'dpp')} {...fi('dpp')} />
          <EditableField label="WHT Rate (%)" value={wht?.whtRate} onSave={handleFieldSave('whtRate')} {...getFieldMetadata(wht?._metadata, 'whtRate')} {...fi('whtRate')} />
          <EditableField label="WHT Amount" value={wht?.whtAmount} isMoney onSave={handleFieldSave('whtAmount')} {...getFieldMetadata(wht?._metadata, 'whtAmount')} {...fi('whtAmount')} />
          <EditableField label="Seller/Merchant NPWP" value={wht?.sellerMerchantNpwp} onSave={handleFieldSave('sellerMerchantNpwp')} {...getFieldMetadata(wht?._metadata, 'sellerMerchantNpwp')} {...fi('sellerMerchantNpwp')} />
          <EditableField label="Seller/Merchant Name" value={wht?.sellerMerchantName} onSave={handleFieldSave('sellerMerchantName')} {...getFieldMetadata(wht?._metadata, 'sellerMerchantName')} {...fi('sellerMerchantName')} />
          <EditableField label="Referenced Invoice Number" value={wht?.referencedInvoiceNumber} onSave={handleFieldSave('referencedInvoiceNumber')} {...getFieldMetadata(wht?._metadata, 'referencedInvoiceNumber')} {...fi('referencedInvoiceNumber')} />
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
          <EditableField label="Issuer Name" value={tax?.issuerName} onSave={handleFieldSave('issuerName')} {...getFieldMetadata(m, 'issuerName')} {...fi('issuerName')} />
          <EditableField label="Issuer NPWP" value={tax?.issuerNpwp} onSave={handleFieldSave('issuerNpwp')} {...getFieldMetadata(m, 'issuerNpwp')} {...fi('issuerNpwp')} />
          <EditableField label="Seller/Merchant NPWP" value={tax?.sellerMerchantNpwp} onSave={handleFieldSave('sellerMerchantNpwp')} {...getFieldMetadata(m, 'sellerMerchantNpwp')} {...fi('sellerMerchantNpwp')} />
          <EditableField label="Seller/Merchant Name" value={tax?.sellerMerchantName} onSave={handleFieldSave('sellerMerchantName')} {...getFieldMetadata(m, 'sellerMerchantName')} {...fi('sellerMerchantName')} />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField label="Total Amount Incl. Tax" value={tax?.totalAmountInclTax} isMoney onSave={handleFieldSave('totalAmountInclTax')} {...getFieldMetadata(m, 'totalAmountInclTax')} {...fi('totalAmountInclTax')} />
          <EditableField label="DPP" value={tax?.dpp} isMoney onSave={handleFieldSave('dpp')} {...getFieldMetadata(m, 'dpp')} {...fi('dpp')} />
          <EditableField label="VAT Amount" value={tax?.vatAmount} isMoney onSave={handleFieldSave('vatAmount')} {...getFieldMetadata(m, 'vatAmount')} {...fi('vatAmount')} />
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
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <EditableField label="Issuer Name" value={invoice?.issuerName} onSave={handleFieldSave('issuerName')} {...getFieldMetadata(m, 'issuerName')} {...fi('issuerName')} />
        <EditableField label="Issuer NPWP" value={invoice?.issuerNpwp} onSave={handleFieldSave('issuerNpwp')} {...getFieldMetadata(m, 'issuerNpwp')} {...fi('issuerNpwp')} />
        <EditableField label="Seller/Merchant Name" value={invoice?.sellerMerchantName} onSave={handleFieldSave('sellerMerchantName')} {...getFieldMetadata(m, 'sellerMerchantName')} {...fi('sellerMerchantName')} />
        <EditableField label="Seller/Merchant Username" value={invoice?.sellerMerchantUsername} onSave={handleFieldSave('sellerMerchantUsername')} {...getFieldMetadata(m, 'sellerMerchantUsername')} {...fi('sellerMerchantUsername')} />
        <EditableField label="Commercial Invoice Number" value={invoice?.commercialInvoiceNumber} onSave={handleFieldSave('commercialInvoiceNumber')} {...getFieldMetadata(m, 'commercialInvoiceNumber')} {...fi('commercialInvoiceNumber')} />
        <EditableField label="Total Amount Incl. Tax" value={invoice?.totalAmountInclTax} isMoney onSave={handleFieldSave('totalAmountInclTax')} {...getFieldMetadata(m, 'totalAmountInclTax')} {...fi('totalAmountInclTax')} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {hasIssues && (
        <div className="flex items-center justify-end">
          <button
            onClick={onClearIssues}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear highlights
          </button>
        </div>
      )}

      {/* WHT Slip */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-semibold">WHT Slip</CardTitle>
        </CardHeader>
        <CardContent className="pt-5 pb-5">
          {renderWHTSlipFields()}
        </CardContent>
      </Card>

      {/* Tax Invoice */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-semibold">Tax Invoice</CardTitle>
        </CardHeader>
        <CardContent className="pt-5 pb-5">
          {renderTaxInvoiceFields()}
        </CardContent>
      </Card>

      {/* Shopee Invoice */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-semibold">Shopee Invoice</CardTitle>
        </CardHeader>
        <CardContent className="pt-5 pb-5">
          {renderShopeeInvoiceFields()}
        </CardContent>
      </Card>
    </div>
  );
}
