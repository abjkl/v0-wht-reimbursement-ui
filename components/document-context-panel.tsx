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

interface EditableFieldProps {
  label: string;
  value: string | number | undefined | null;
  isMoney?: boolean;
  onSave?: (newValue: string) => void;
}

function EditableField({ label, value, isMoney, onSave }: EditableFieldProps) {
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
    <div className="group">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleSave}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </>
        ) : (
          <>
            <p className={`text-sm flex-1 ${isEmpty ? 'text-muted-foreground' : 'text-foreground'}`}>
              {displayValue}
            </p>
            {onSave && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function DocumentContextPanel({ request, activeTab }: DocumentContextPanelProps) {
  const handleFieldSave = (field: string) => (newValue: string) => {
    console.log('[v0] Saving field:', field, newValue);
  };

  const renderWHTSlipFields = () => {
    const wht = request.extracted?.whtSlip;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="WHT Slip Number (Nomor Bukti Potong)"
            value={wht?.slipNumber}
            onSave={handleFieldSave('slipNumber')}
          />
          <EditableField
            label="Tax Period / Masa Pajak (MM-YYYY)"
            value={wht?.taxPeriod}
            onSave={handleFieldSave('taxPeriod')}
          />
          <EditableField
            label="WHT Code"
            value={wht?.whtCode}
            onSave={handleFieldSave('whtCode')}
          />
          <EditableField
            label="WHT Rate (%)"
            value={wht?.whtRate}
            onSave={handleFieldSave('whtRate')}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="Taxpayer NPWP (Shopee)"
            value={wht?.taxpayerNpwp}
            onSave={handleFieldSave('taxpayerNpwp')}
          />
          <EditableField
            label="Taxpayer Name (Shopee)"
            value={wht?.taxpayerName}
            onSave={handleFieldSave('taxpayerName')}
          />
          <EditableField
            label="Collector NPWP (Seller/Merchant)"
            value={wht?.collectorNpwp}
            onSave={handleFieldSave('collectorNpwp')}
          />
          <EditableField
            label="Collector Name (Seller/Merchant)"
            value={wht?.collectorName}
            onSave={handleFieldSave('collectorName')}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="Tax Base / DPP"
            value={wht?.taxBase}
            isMoney
            onSave={handleFieldSave('taxBase')}
          />
          <EditableField
            label="WHT Amount (PPh23)"
            value={wht?.whtAmount}
            isMoney
            onSave={handleFieldSave('whtAmount')}
          />
          <div className="col-span-2">
            <EditableField
              label="Referenced Invoice Number"
              value={wht?.referencedInvoiceNumber}
              onSave={handleFieldSave('referencedInvoiceNumber')}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTaxInvoiceFields = () => {
    const tax = request.extracted?.taxInvoice;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="Tax Invoice Number"
            value={tax?.taxInvoiceNumber}
            onSave={handleFieldSave('taxInvoiceNumber')}
          />
          <EditableField
            label="Tax Invoice Date"
            value={tax?.taxInvoiceDate}
            onSave={handleFieldSave('taxInvoiceDate')}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="Issuer NPWP"
            value={tax?.issuerNpwp}
            onSave={handleFieldSave('issuerNpwp')}
          />
          <EditableField
            label="Issuer Name"
            value={tax?.issuerName}
            onSave={handleFieldSave('issuerName')}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="Buyer NPWP"
            value={tax?.buyerNpwp}
            onSave={handleFieldSave('buyerNpwp')}
          />
          <EditableField
            label="Buyer Name"
            value={tax?.buyerName}
            onSave={handleFieldSave('buyerName')}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="DPP (Tax Base)"
            value={tax?.dppTaxBase}
            isMoney
            onSave={handleFieldSave('dppTaxBase')}
          />
          <EditableField
            label="VAT Amount (PPN)"
            value={tax?.vatAmount}
            isMoney
            onSave={handleFieldSave('vatAmount')}
          />
          <div className="col-span-2">
            <EditableField
              label="Total Amount"
              value={tax?.totalAmount}
              isMoney
              onSave={handleFieldSave('totalAmount')}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderShopeeInvoiceFields = () => {
    const invoice = request.extracted?.shopeeInvoice;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="Invoice Number (OCR)"
            value={invoice?.invoiceNumberOcr}
            onSave={handleFieldSave('invoiceNumberOcr')}
          />
          <EditableField
            label="Invoice Date"
            value={invoice?.invoiceDate}
            onSave={handleFieldSave('invoiceDate')}
          />
          <EditableField
            label="Issuer Name"
            value={invoice?.issuerName}
            onSave={handleFieldSave('issuerName')}
          />
          <EditableField
            label="Issuer NPWP"
            value={invoice?.issuerNpwp}
            onSave={handleFieldSave('issuerNpwp')}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditableField
            label="Amount Before Tax"
            value={invoice?.amountBeforeTax}
            isMoney
            onSave={handleFieldSave('amountBeforeTax')}
          />
          <EditableField
            label="Total Amount"
            value={invoice?.totalAmount}
            isMoney
            onSave={handleFieldSave('totalAmount')}
          />
          <EditableField
            label="Currency"
            value={invoice?.currency}
            onSave={handleFieldSave('currency')}
          />
          <EditableField
            label="Line Item Count"
            value={invoice?.lineItemCount}
            onSave={handleFieldSave('lineItemCount')}
          />
        </div>

        {invoice?.description && (
          <>
            <Separator />
            <EditableField
              label="Invoice Description"
              value={invoice.description}
              onSave={handleFieldSave('description')}
            />
          </>
        )}
      </div>
    );
  };

  const getDocumentTitle = () => {
    switch (activeTab) {
      case 'wht-slip':
        return 'Parsed Key Fields - WHT Slip';
      case 'tax-invoice':
        return 'Parsed Key Fields - Tax Invoice';
      case 'shopee-invoice':
        return 'Parsed Key Fields - Shopee Invoice';
      default:
        return 'Parsed Key Fields';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-3">
        <CardTitle className="text-base font-semibold">{getDocumentTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {activeTab === 'wht-slip' && renderWHTSlipFields()}
        {activeTab === 'tax-invoice' && renderTaxInvoiceFields()}
        {activeTab === 'shopee-invoice' && renderShopeeInvoiceFields()}
      </CardContent>
    </Card>
  );
}
