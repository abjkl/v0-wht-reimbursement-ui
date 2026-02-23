'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { WHTRequest } from '@/lib/types';
import { formatCurrency } from '@/lib/filter-utils';

interface DocumentContextPanelProps {
  request: WHTRequest;
  activeTab: string;
}

type ValidationResult = 'pass' | 'warn' | 'fail';

interface ValidationItem {
  label: string;
  value: string;
  status: ValidationResult;
  reason?: string;
}

export function DocumentContextPanel({ request, activeTab }: DocumentContextPanelProps) {
  const { extracted } = request;

  const getValidationBadge = (status: ValidationResult) => {
    switch (status) {
      case 'pass':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600 text-xs">
            <CheckCircle2 className="h-3 w-3" />
            Pass
          </Badge>
        );
      case 'warn':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500 text-white text-xs">
            <AlertTriangle className="h-3 w-3" />
            Warn
          </Badge>
        );
      case 'fail':
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <AlertCircle className="h-3 w-3" />
            Fail
          </Badge>
        );
    }
  };

  // WHT Slip Tab Content
  if (activeTab === 'wht-slip') {
    const whtData = extracted?.whtSlip;
    const expectedWHT = whtData?.taxBase ? Math.round(0.02 * whtData.taxBase) : 0;
    const actualWHT = whtData?.whtAmount || 0;
    const diffActualExpected = actualWHT - expectedWHT;
    const diffRequestedActual = request.requestedReimbursementAmount - actualWHT;

    const getComputationStatus = (diff: number): ValidationResult => {
      const absDiff = Math.abs(diff);
      if (absDiff <= 10) return 'pass';
      if (absDiff <= 100) return 'warn';
      return 'fail';
    };

    // Cross-document validations
    const entityMatch: ValidationItem = {
      label: 'Entity Identity Match (A1/A2)',
      value: `${whtData?.taxpayerNpwp || '—'} vs ${extracted?.taxInvoice?.issuerNpwp || '—'}`,
      status: whtData?.taxpayerNpwp === extracted?.taxInvoice?.issuerNpwp ? 'pass' : 'fail',
      reason: whtData?.taxpayerNpwp === extracted?.taxInvoice?.issuerNpwp
        ? 'NPWP matches'
        : 'NPWP mismatch between WHT slip taxpayer and tax invoice issuer'
    };

    const collectorMatch: ValidationItem = {
      label: 'Collector Identity Match (C1/C3)',
      value: `${whtData?.collectorNpwp || '—'} vs ${extracted?.taxInvoice?.buyerNpwp || '—'}`,
      status: whtData?.collectorNpwp === extracted?.taxInvoice?.buyerNpwp ? 'pass' : 'fail',
      reason: whtData?.collectorNpwp === extracted?.taxInvoice?.buyerNpwp
        ? 'NPWP matches'
        : 'NPWP mismatch between WHT slip collector and tax invoice buyer'
    };

    const invoiceRefMatch: ValidationItem = {
      label: 'Invoice Reference Match (B9)',
      value: `Slip: ${whtData?.referencedInvoiceNumber || '—'}, Tax Inv: ${extracted?.taxInvoice?.taxInvoiceNumber || '—'}, Shopee: ${request.invoiceNumber}`,
      status: whtData?.referencedInvoiceNumber === extracted?.taxInvoice?.taxInvoiceNumber ? 'pass' : 'warn',
      reason: whtData?.referencedInvoiceNumber === extracted?.taxInvoice?.taxInvoiceNumber
        ? 'Invoice numbers match'
        : 'Invoice reference may point to Shopee invoice instead of tax invoice'
    };

    return (
      <>
        {/* Document Key Fields */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-3">
            <CardTitle className="text-base font-semibold">Document Key Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!whtData ? (
              <p className="text-sm text-muted-foreground">Document not extracted or not available</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">WHT Slip Number</p>
                    <p className="text-sm">{whtData.slipNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Tax Period (Masa Pajak)</p>
                    <p className="text-sm">{whtData.taxPeriod || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">WHT Code</p>
                    <p className="text-sm">{whtData.whtCode || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">WHT Rate</p>
                    <p className="text-sm">{whtData.whtRate ? `${whtData.whtRate}%` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Tax Base (DPP)</p>
                    <p className="text-sm">{whtData.taxBase ? formatCurrency(whtData.taxBase) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">WHT Amount</p>
                    <p className="text-sm font-semibold">{whtData.whtAmount ? formatCurrency(whtData.whtAmount) : '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-foreground">Referenced Invoice No</p>
                    <p className="text-sm">{whtData.referencedInvoiceNumber || '—'}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Computation Preview</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Expected WHT (2% × Tax Base)</p>
                      <p className="text-sm font-medium">{formatCurrency(expectedWHT)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Actual WHT Amount</p>
                      <p className="text-sm font-medium">{formatCurrency(actualWHT)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Diff (Actual - Expected)</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{formatCurrency(diffActualExpected)}</p>
                        {getValidationBadge(getComputationStatus(diffActualExpected))}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Requested Reimbursement (Seller)</p>
                      <p className="text-sm font-medium">{formatCurrency(request.requestedReimbursementAmount)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Diff (Requested - Actual)</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{formatCurrency(diffRequestedActual)}</p>
                        {getValidationBadge(getComputationStatus(diffRequestedActual))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cross-Document Comparison */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-3">
            <CardTitle className="text-base font-semibold">Cross-Document Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {[entityMatch, collectorMatch, invoiceRefMatch].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.value}</p>
                    {item.reason && <p className="text-xs text-muted-foreground mt-1 italic">{item.reason}</p>}
                  </div>
                  {getValidationBadge(item.status)}
                </div>
                {idx < 2 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    );
  }

  // Tax Invoice Tab Content
  if (activeTab === 'tax-invoice') {
    const taxInvData = extracted?.taxInvoice;
    const whtData = extracted?.whtSlip;

    const entityMatch: ValidationItem = {
      label: 'Entity Identity Match',
      value: `Tax Inv Issuer: ${taxInvData?.issuerNpwp || '—'} vs WHT Slip Taxpayer: ${whtData?.taxpayerNpwp || '—'}`,
      status: taxInvData?.issuerNpwp === whtData?.taxpayerNpwp ? 'pass' : 'fail',
      reason: taxInvData?.issuerNpwp === whtData?.taxpayerNpwp ? 'NPWP matches' : 'NPWP mismatch'
    };

    const collectorMatch: ValidationItem = {
      label: 'Collector Identity Match',
      value: `Tax Inv Buyer: ${taxInvData?.buyerNpwp || '—'} vs WHT Slip Collector: ${whtData?.collectorNpwp || '—'}`,
      status: taxInvData?.buyerNpwp === whtData?.collectorNpwp ? 'pass' : 'fail',
      reason: taxInvData?.buyerNpwp === whtData?.collectorNpwp ? 'NPWP matches' : 'NPWP mismatch'
    };

    const taxBaseMatch: ValidationItem = {
      label: 'Tax Base Match (B5)',
      value: `DPP: ${taxInvData?.dppTaxBase ? formatCurrency(taxInvData.dppTaxBase) : '—'} vs WHT Tax Base: ${whtData?.taxBase ? formatCurrency(whtData.taxBase) : '—'}`,
      status: taxInvData?.dppTaxBase === whtData?.taxBase ? 'pass' : 'warn',
      reason: taxInvData?.dppTaxBase === whtData?.taxBase ? 'Tax base amounts match' : 'Tax base amounts differ'
    };

    const invoiceRefMatch: ValidationItem = {
      label: 'Invoice Reference Match (B9)',
      value: `Tax Inv No: ${taxInvData?.taxInvoiceNumber || '—'} vs WHT Slip Ref: ${whtData?.referencedInvoiceNumber || '—'}`,
      status: taxInvData?.taxInvoiceNumber === whtData?.referencedInvoiceNumber ? 'pass' : 'warn',
      reason: taxInvData?.taxInvoiceNumber === whtData?.referencedInvoiceNumber
        ? 'Invoice numbers match'
        : 'WHT slip may reference Shopee invoice instead'
    };

    return (
      <>
        {/* Document Key Fields */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-3">
            <CardTitle className="text-base font-semibold">Document Key Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!taxInvData ? (
              <p className="text-sm text-muted-foreground">Document not extracted or not available</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Tax Invoice Number</p>
                  <p className="text-sm">{taxInvData.taxInvoiceNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tax Invoice Date</p>
                  <p className="text-sm">{taxInvData.taxInvoiceDate || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">DPP Tax Base</p>
                  <p className="text-sm font-semibold">{taxInvData.dppTaxBase ? formatCurrency(taxInvData.dppTaxBase) : '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">VAT Amount</p>
                  <p className="text-sm">{taxInvData.vatAmount ? formatCurrency(taxInvData.vatAmount) : '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Total Amount</p>
                  <p className="text-sm">{taxInvData.totalAmount ? formatCurrency(taxInvData.totalAmount) : '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-foreground">Issuer</p>
                  <p className="text-sm">{taxInvData.issuerName || '—'}</p>
                  <p className="text-xs text-muted-foreground">NPWP: {taxInvData.issuerNpwp || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-foreground">Buyer</p>
                  <p className="text-sm">{taxInvData.buyerName || '—'}</p>
                  <p className="text-xs text-muted-foreground">NPWP: {taxInvData.buyerNpwp || '—'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cross-Document Comparison */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-3">
            <CardTitle className="text-base font-semibold">Cross-Document Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {[entityMatch, collectorMatch, taxBaseMatch, invoiceRefMatch].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.value}</p>
                    {item.reason && <p className="text-xs text-muted-foreground mt-1 italic">{item.reason}</p>}
                  </div>
                  {getValidationBadge(item.status)}
                </div>
                {idx < 3 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    );
  }

  // Shopee Invoice Tab Content
  if (activeTab === 'invoice') {
    const shopeeData = extracted?.shopeeInvoice;
    const whtData = extracted?.whtSlip;
    const taxInvData = extracted?.taxInvoice;

    const invoiceRefMatch: ValidationItem = {
      label: 'Invoice Reference Match (B9)',
      value: `Seller Input: ${request.invoiceNumber}, OCR: ${shopeeData?.invoiceNumberOcr || '—'}, WHT Slip Ref: ${whtData?.referencedInvoiceNumber || '—'}`,
      status: (request.invoiceNumber === whtData?.referencedInvoiceNumber || shopeeData?.invoiceNumberOcr === whtData?.referencedInvoiceNumber) ? 'pass' : 'fail',
      reason: 'Check if WHT slip references Shopee invoice number'
    };

    const taxInvLinking: ValidationItem = {
      label: 'Tax Invoice Linking',
      value: `Shopee: ${request.invoiceNumber} vs Tax Inv: ${taxInvData?.taxInvoiceNumber || '—'}`,
      status: 'warn',
      reason: 'Shopee invoice and tax invoice may be different documents'
    };

    return (
      <>
        {/* Document Key Fields */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-3">
            <CardTitle className="text-base font-semibold">Document Key Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-foreground">Seller Input Invoice Number</p>
                <p className="text-sm">{request.invoiceNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-foreground">OCR Extracted Invoice Number</p>
                <p className="text-sm">{shopeeData?.invoiceNumberOcr || '—'}</p>
                {!shopeeData?.invoiceNumberOcr && <p className="text-xs text-muted-foreground italic">Not extracted</p>}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Invoice Date</p>
                <p className="text-sm">{shopeeData?.invoiceDate || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Issuer Name</p>
                <p className="text-sm">{shopeeData?.issuerName || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Amount Before Tax</p>
                <p className="text-sm">{shopeeData?.amountBeforeTax ? formatCurrency(shopeeData.amountBeforeTax) : '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Total Amount</p>
                <p className="text-sm font-semibold">{shopeeData?.totalAmount ? formatCurrency(shopeeData.totalAmount) : '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross-Document Comparison */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-3">
            <CardTitle className="text-base font-semibold">Cross-Document Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {[invoiceRefMatch, taxInvLinking].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.value}</p>
                    {item.reason && <p className="text-xs text-muted-foreground mt-1 italic">{item.reason}</p>}
                  </div>
                  {getValidationBadge(item.status)}
                </div>
                {idx < 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    );
  }

  return null;
}
