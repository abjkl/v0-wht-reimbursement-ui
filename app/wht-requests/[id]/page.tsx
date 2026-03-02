'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DocumentContextPanel } from '@/components/document-context-panel';
import { AIReviewDrawer } from '@/components/ai-review-drawer';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/filter-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { requests, updateRequest, addAuditLog } = useStore();
  const [notes, setNotes] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [activeDocTab, setActiveDocTab] = useState('wht-slip');
  const [showAIDrawer, setShowAIDrawer] = useState(true);
  const [fieldIssues, setFieldIssues] = useState<Record<string, { status: 'warn' | 'fail'; reason: string }> | null>(null);

  const request = requests.find(r => r.id === params.id);

  if (!request) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Request Not Found</h2>
          <Button className="mt-4" onClick={() => router.push('/wht-requests')}>
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  // Indonesia WHT (PPh23) Validation Checks
  type CheckStatus = 'pass' | 'warn' | 'fail';
  type ValidationCheck = {
    section: string;
    label: string;
    status: CheckStatus;
    helper: string;
    reason?: string;
  };

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
    if (!wht?.collectorNpwp || !tax?.buyerNpwp) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    const npwpMatch = wht.collectorNpwp === tax.buyerNpwp;
    const nameMatch = wht.collectorName?.toLowerCase() === tax.buyerName?.toLowerCase();
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
      ref === shopee?.invoiceNumberOcr;
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
    if (wht?.taxBase == null || tax?.dppTaxBase == null) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    if (wht.taxBase !== tax.dppTaxBase) return { status: 'fail' as CheckStatus, reason: 'Tax base mismatch' };
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
    if (wht?.taxBase == null || wht?.whtAmount == null) return { status: 'warn' as CheckStatus, reason: 'Not extracted' };
    const expected = Math.round(0.02 * wht.taxBase);
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

  // SECTION E — Compliance & Eligibility
  const exemptionCheck = () => {
    if (request.exemptionPeriod == null) return { status: 'warn' as CheckStatus, reason: 'Policy config needed' };
    if (request.exemptionPeriod.isInExemption) return { status: 'fail' as CheckStatus, reason: 'In exemption period' };
    return { status: 'pass' as CheckStatus };
  };
  const exemptionResult = exemptionCheck();
  validationChecks.push({
    section: 'Compliance & Eligibility',
    label: 'Not in Exemption Period (SKB)',
    status: exemptionResult.status,
    helper: 'Seller must not have active tax exemption',
    reason: exemptionResult.reason
  });

  const duplicateCheck = () => {
    if (request.duplicate == null) return { status: 'warn' as CheckStatus, reason: 'Duplicate check not available' };
    if (request.duplicate.isDuplicate) return { status: 'fail' as CheckStatus, reason: 'Duplicate submission detected' };
    return { status: 'pass' as CheckStatus };
  };
  const duplicateResult = duplicateCheck();
  validationChecks.push({
    section: 'Compliance & Eligibility',
    label: 'Not Duplicate Submission',
    status: duplicateResult.status,
    helper: 'Request must not be a duplicate',
    reason: duplicateResult.reason
  });

  const eligibilityCheck = () => {
    if (request.eligibility == null) return { status: 'warn' as CheckStatus, reason: 'Eligibility not evaluated' };
    if (!request.eligibility.isEligible) return { status: 'fail' as CheckStatus, reason: request.eligibility.reason || 'Not eligible' };
    return { status: 'pass' as CheckStatus };
  };
  const eligibilityResult = eligibilityCheck();
  validationChecks.push({
    section: 'Compliance & Eligibility',
    label: 'Eligible for Reimbursement',
    status: eligibilityResult.status,
    helper: 'Seller type and transaction must be eligible',
    reason: eligibilityResult.reason
  });

  // Summary counts
  const passedChecks = validationChecks.filter(c => c.status === 'pass').length;
  const warnChecks = validationChecks.filter(c => c.status === 'warn').length;
  const failedChecks = validationChecks.filter(c => c.status === 'fail').length;

  // Map validation check labels to field names for highlighting
  const checkToFieldMap: Record<string, string[]> = {
    'Entity Identity Match (Shopee)': ['taxpayerNpwp', 'taxpayerName', 'issuerNpwp', 'issuerName'],
    'Collector Identity Match (Seller/Merchant)': ['collectorNpwp', 'collectorName', 'buyerNpwp', 'buyerName'],
    'Invoice Reference Match (B9)': ['referencedInvoiceNumber', 'taxInvoiceNumber', 'invoiceNumberOcr'],
    'WHT Code Allowed (B3)': ['whtCode'],
    'WHT Rate = 2% (B6)': ['whtRate'],
    'Tax Base Match (B5)': ['taxBase', 'dppTaxBase'],
    'WHT Amount Correct (B7)': ['whtAmount'],
    'Requested Amount Matches WHT': ['whtAmount'],
  };

  const handleCheckDetails = () => {
    const issues: Record<string, { status: 'warn' | 'fail'; reason: string }> = {};
    validationChecks
      .filter(c => c.status !== 'pass')
      .forEach(check => {
        const fields = checkToFieldMap[check.label];
        if (fields) {
          fields.forEach(field => {
            // fail takes priority over warn
            if (!issues[field] || (check.status === 'fail' && issues[field].status === 'warn')) {
              issues[field] = { status: check.status as 'warn' | 'fail', reason: check.reason || check.helper };
            }
          });
        }
      });
    setFieldIssues(issues);
    setActiveDocTab('wht-slip');
  };

  const handleClearIssues = () => {
    setFieldIssues(null);
  };

  const handleApprove = () => {
    updateRequest(request.id, {
      status: 'Approved',
      approvalStatusYN: 'Y',
      approverName: 'tax.manager@company.com',
      approvalDate: new Date().toISOString().split('T')[0],
      notes: notes || request.notes
    });
    addAuditLog(request.id, {
      timestamp: new Date().toISOString(),
      actor: 'tax.manager@company.com',
      action: 'Approved request',
      details: notes || undefined
    });
    toast.success('Request approved successfully');
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    const rejectionNote = `Rejected: ${rejectionReasons.join(', ')}${notes ? ` - ${notes}` : ''}`;
    updateRequest(request.id, {
      status: 'Rejected',
      approvalStatusYN: 'N',
      approverName: 'tax.manager@company.com',
      approvalDate: new Date().toISOString().split('T')[0],
      notes: rejectionNote
    });
    addAuditLog(request.id, {
      timestamp: new Date().toISOString(),
      actor: 'tax.manager@company.com',
      action: 'Rejected request',
      details: rejectionNote
    });
    toast.error('Request rejected');
    setShowRejectDialog(false);
    setRejectionReasons([]);
  };

  const rejectionOptions = [
    'Missing or incomplete documentation',
    'Invoice number mismatch',
    'Invalid amount',
    'Company information incomplete',
    'Tax invoice issues',
    'WHT slip issues',
    'Duplicate request',
    'Other'
  ];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header Bar */}
      <div className="border-b bg-background px-6 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => router.push('/wht-requests')}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <span className="text-muted-foreground/40">{'/'}</span>
            <span className="font-medium text-foreground">{request.id}</span>
            <Badge variant="secondary" className="text-xs">
              {request.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/wht-requests/${request.id}/attachments`)}
            >
              Attachments
            </Button>
            <Button
              variant={showAIDrawer ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAIDrawer(!showAIDrawer)}
              className="gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Review
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="border-b bg-muted/20 px-6 py-3">
        <div className="flex items-center gap-8 text-sm">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Submission Date</span>
            <span className="font-medium">{request.submissionDate}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</span>
            <span className="font-medium">{request.requestorEmail}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Username</span>
            <span className="font-medium">{request.usernameShopee || request.merchantName || '\u2014'}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Company Name</span>
            <span className="font-medium">{request.sellerCompanyName || request.syncedCompanyName || '\u2014'}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">WHT.23 Reimbursement Amount</span>
            <span className="font-medium tabular-nums">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(request.requestedReimbursementAmount)}
            </span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Suggestion</span>
            <Badge
              variant={
                request.aiSuggestion === 'Approve'
                  ? 'default'
                  : request.aiSuggestion === 'Reject'
                  ? 'destructive'
                  : 'secondary'
              }
              className="mt-0.5 w-fit text-[10px]"
            >
              {request.aiSuggestion}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden bg-background">
        {/* Left: Parsed Fields (primary content) */}
        <div className="flex-1 min-w-0 overflow-auto pb-28">
          {/* Document Tab Switcher */}
          <div className="sticky top-0 z-10 flex items-center gap-1 border-b bg-background px-6 py-2">
            {[
              { key: 'wht-slip', label: 'WHT Slip' },
              { key: 'tax-invoice', label: 'Tax Invoice' },
              { key: 'shopee-invoice', label: 'Shopee Invoice' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveDocTab(tab.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeDocTab === tab.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <DocumentContextPanel request={request} activeTab={activeDocTab} fieldIssues={fieldIssues} onClearIssues={handleClearIssues} />
          </div>
        </div>

        {/* Right Drawer - AI Review */}
        <AIReviewDrawer
          request={request}
          validationChecks={validationChecks}
          passedChecks={passedChecks}
          warnChecks={warnChecks}
          failedChecks={failedChecks}
          open={showAIDrawer}
          onClose={() => setShowAIDrawer(false)}
          onApprove={handleApprove}
          onReject={() => setShowRejectDialog(true)}
          onCheckDetails={handleCheckDetails}
        />
      </div>

      {/* Sticky Bottom Actions */}
      {request.status !== 'Approved' && request.status !== 'Rejected' && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card shadow-lg z-20">
          <div className="flex items-center justify-end gap-3 px-6 py-3">
            <Button
              variant="ghost"
              onClick={() => setShowRejectDialog(true)}
              className="h-9 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-4 w-4" />
              Reject to Requestor
            </Button>
            <Button
              onClick={() => setShowApproveDialog(true)}
              className="h-9"
            >
              Next Step
            </Button>
          </div>
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this WHT reimbursement request?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium">Request ID: {request.id}</p>
              <p className="text-sm text-muted-foreground">
                Amount: {formatCurrency(request.requestedReimbursementAmount)}
              </p>
            </div>
            <Textarea
              placeholder="Optional approval notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please select reason(s) for rejection. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {rejectionOptions.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <Checkbox
                    id={reason}
                    checked={rejectionReasons.includes(reason)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setRejectionReasons([...rejectionReasons, reason]);
                      } else {
                        setRejectionReasons(rejectionReasons.filter((r) => r !== reason));
                      }
                    }}
                  />
                  <label
                    htmlFor={reason}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {reason}
                  </label>
                </div>
              ))}
            </div>
            <Textarea
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectionReasons.length === 0}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
