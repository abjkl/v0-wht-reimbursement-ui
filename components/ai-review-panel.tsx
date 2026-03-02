'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { WHTRequest } from '@/lib/types';

interface AIReviewPanelProps {
  request: WHTRequest;
}

type CheckStatus = 'pass' | 'warn' | 'fail';
type ValidationCheck = {
  section: string;
  label: string;
  status: CheckStatus;
  helper: string;
  reason?: string;
};

export function AIReviewPanel({ request }: AIReviewPanelProps) {
  const wht = request.extracted?.whtSlip;
  const tax = request.extracted?.taxInvoice;
  const shopee = request.extracted?.shopeeInvoice;

  const validationChecks: ValidationCheck[] = [];

  // SECTION A — Document Completeness
  validationChecks.push({
    section: 'Document Completeness',
    label: 'WHT Slip Uploaded',
    status: request.whtSlipUrl ? 'pass' : 'fail',
    helper: 'WHT slip document must be attached',
    reason: !request.whtSlipUrl ? 'Document missing' : undefined
  });
  validationChecks.push({
    section: 'Document Completeness',
    label: 'Tax Invoice Uploaded',
    status: request.taxInvoiceUrl ? 'pass' : 'fail',
    helper: 'Tax invoice document must be attached',
    reason: !request.taxInvoiceUrl ? 'Document missing' : undefined
  });
  validationChecks.push({
    section: 'Document Completeness',
    label: 'Shopee Invoice Uploaded',
    status: request.invoiceUrl ? 'pass' : 'fail',
    helper: 'Shopee commercial invoice must be attached',
    reason: !request.invoiceUrl ? 'Document missing' : undefined
  });

  // SECTION B — Identity Validation
  const entityMatch = () => {
    if (!wht?.taxpayerNpwp || !tax?.issuerNpwp) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    const npwpMatch = wht.taxpayerNpwp === tax.issuerNpwp;
    const nameMatch = wht.taxpayerName?.toLowerCase() === tax.issuerName?.toLowerCase();
    if (!npwpMatch || !nameMatch) return { status: 'fail' as CheckStatus, reason: 'NPWP/Name mismatch' };
    return { status: 'pass' as CheckStatus };
  };
  const entityResult = entityMatch();
  validationChecks.push({
    section: 'Identity Validation',
    label: 'Entity Identity Match (Shopee)',
    status: entityResult.status,
    helper: 'Taxpayer NPWP/Name must match tax invoice issuer',
    reason: entityResult.reason
  });

  const collectorMatch = () => {
    if (!wht?.sellerMerchantNpwp || !tax?.sellerMerchantNpwp) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    const npwpMatch = wht.sellerMerchantNpwp === tax.sellerMerchantNpwp;
    const nameMatch = wht.sellerMerchantName?.toLowerCase() === tax.sellerMerchantName?.toLowerCase();
    if (!npwpMatch || !nameMatch) return { status: 'fail' as CheckStatus, reason: 'NPWP/Name mismatch' };
    return { status: 'pass' as CheckStatus };
  };
  const collectorResult = collectorMatch();
  validationChecks.push({
    section: 'Identity Validation',
    label: 'Collector Identity Match (Seller/Merchant)',
    status: collectorResult.status,
    helper: 'Collector NPWP/Name must match tax invoice buyer',
    reason: collectorResult.reason
  });

  // SECTION C — Invoice Matching
  const invoiceRefMatch = () => {
    if (!wht?.referencedInvoiceNumber) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    const ref = wht.referencedInvoiceNumber;
    const matches = 
      ref === tax?.taxInvoiceNumber ||
      ref === request.invoiceNumber ||
      ref === shopee?.commercialInvoiceNumber;
    if (!matches) return { status: 'fail' as CheckStatus, reason: 'Referenced invoice not found' };
    return { status: 'pass' as CheckStatus };
  };
  const invoiceRefResult = invoiceRefMatch();
  validationChecks.push({
    section: 'Invoice Matching',
    label: 'Invoice Reference Match (B9)',
    status: invoiceRefResult.status,
    helper: 'Referenced invoice must match tax or Shopee invoice',
    reason: invoiceRefResult.reason
  });

  validationChecks.push({
    section: 'Invoice Matching',
    label: 'Single Invoice per Slip',
    status: 'pass',
    helper: 'MVP: one request = one invoice',
  });

  // SECTION D — Tax Calculation
  const allowedCodes = ['24-104-18', '24-104-34', '24-104-02'];
  const codeCheck = () => {
    if (!wht?.whtCode) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    if (!allowedCodes.includes(wht.whtCode)) return { status: 'fail' as CheckStatus, reason: 'Code not allowed' };
    return { status: 'pass' as CheckStatus };
  };
  const codeResult = codeCheck();
  validationChecks.push({
    section: 'Tax Calculation',
    label: 'WHT Code Allowed (B3)',
    status: codeResult.status,
    helper: 'Must be 24-104-18, 24-104-34, or 24-104-02',
    reason: codeResult.reason
  });

  const rateCheck = () => {
    if (wht?.whtRate == null) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    if (wht.whtRate !== 2) return { status: 'fail' as CheckStatus, reason: 'Rate must be 2%' };
    return { status: 'pass' as CheckStatus };
  };
  const rateResult = rateCheck();
  validationChecks.push({
    section: 'Tax Calculation',
    label: 'WHT Rate = 2% (B6)',
    status: rateResult.status,
    helper: 'WHT rate must be exactly 2%',
    reason: rateResult.reason
  });

  const taxBaseCheck = () => {
    if (wht?.dpp == null || tax?.dpp == null) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    if (wht.dpp !== tax.dpp) return { status: 'fail' as CheckStatus, reason: 'Tax base mismatch' };
    return { status: 'pass' as CheckStatus };
  };
  const taxBaseResult = taxBaseCheck();
  validationChecks.push({
    section: 'Tax Calculation',
    label: 'Tax Base Match (B5)',
    status: taxBaseResult.status,
    helper: 'WHT slip tax base must equal tax invoice DPP',
    reason: taxBaseResult.reason
  });

  const whtAmountCheck = () => {
    if (wht?.dpp == null || wht?.whtAmount == null) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    const expected = Math.round(0.02 * wht.dpp);
    const diff = Math.abs(wht.whtAmount - expected);
    if (diff > 10) return { status: 'fail' as CheckStatus, reason: 'Amount not within ±10 tolerance' };
    return { status: 'pass' as CheckStatus };
  };
  const whtAmountResult = whtAmountCheck();
  validationChecks.push({
    section: 'Tax Calculation',
    label: 'WHT Amount Correct (B7)',
    status: whtAmountResult.status,
    helper: 'WHT amount = 2% of tax base (±10 tolerance)',
    reason: whtAmountResult.reason
  });

  const requestedAmountCheck = () => {
    if (wht?.whtAmount == null) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    const diff = Math.abs(request.requestedReimbursementAmount - wht.whtAmount);
    if (diff > 10) return { status: 'warn' as CheckStatus, reason: 'Difference > 10' };
    return { status: 'pass' as CheckStatus };
  };
  const requestedAmountResult = requestedAmountCheck();
  validationChecks.push({
    section: 'Tax Calculation',
    label: 'Requested Amount Matches WHT',
    status: requestedAmountResult.status,
    helper: 'Requested amount should match WHT slip amount',
    reason: requestedAmountResult.reason
  });



  // Summary counts
  const passedChecks = validationChecks.filter(c => c.status === 'pass').length;
  const warnChecks = validationChecks.filter(c => c.status === 'warn').length;
  const failedChecks = validationChecks.filter(c => c.status === 'fail').length;

  // Group checks by section
  const groupedChecks = validationChecks.reduce((acc, check) => {
    if (!acc[check.section]) acc[check.section] = [];
    acc[check.section].push(check);
    return acc;
  }, {} as Record<string, ValidationCheck[]>);

  const getVariant = () => {
    switch (request.aiSuggestion) {
      case 'Approve':
        return 'default';
      case 'Reject':
        return 'destructive';
      case 'Pending Review':
        return 'secondary';
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-base">AI Review Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={getVariant()} className="text-sm">
            {request.aiSuggestion}
          </Badge>
          <span className="text-sm font-medium">{Math.round(request.aiConfidence * 100)}% Confidence</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Confidence Score</span>
            <span>{Math.round(request.aiConfidence * 100)}%</span>
          </div>
          <Progress value={request.aiConfidence * 100} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Validation Checks</p>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">{passedChecks}</span> · 
              <span className="text-yellow-600 font-medium ml-1">{warnChecks}</span> · 
              <span className="text-destructive font-medium ml-1">{failedChecks}</span>
            </p>
          </div>

          {Object.entries(groupedChecks).map(([section, checks]) => (
            <div key={section} className="space-y-2">
              <p className="text-xs font-semibold text-foreground">{section}</p>
              {checks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-2 pl-2">
                  {check.status === 'pass' && (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  )}
                  {check.status === 'warn' && (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                  )}
                  {check.status === 'fail' && (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.helper}</p>
                    {check.reason && (
                      <p className="text-xs text-muted-foreground italic">{check.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
