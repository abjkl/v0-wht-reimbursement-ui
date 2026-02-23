'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DocumentViewer } from '@/components/document-viewer';
import { DocumentContextPanel } from '@/components/document-context-panel';
import { AIReviewPanel } from '@/components/ai-review-panel';
import { AuditLog } from '@/components/audit-log';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
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
  const [showManualDecision, setShowManualDecision] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState('wht-slip');
  const [showAllValidationChecks, setShowAllValidationChecks] = useState(false);

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

  // Validation checks
  const validationChecks = [
    {
      label: 'Docs Complete',
      passed: request.docsComplete.invoice && request.docsComplete.taxInvoice && request.docsComplete.whtSlip,
    },
    {
      label: 'Invoice Valid',
      passed: !!request.invoiceNumber,
    },
    {
      label: 'Amount Valid',
      passed: request.requestedReimbursementAmount > 0,
    },
    {
      label: 'Company Info',
      passed: !!(request.sellerCompanyName || request.syncedCompanyName),
    }
  ];

  const passedChecks = validationChecks.filter(c => c.passed).length;

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

  const handleAcceptAI = () => {
    if (request.aiSuggestion === 'Approve') {
      setShowApproveDialog(true);
    } else if (request.aiSuggestion === 'Reject') {
      setShowRejectDialog(true);
    }
  };

  const getStatusBadgeVariant = (status: typeof request.status) => {
    switch (status) {
      case 'Submitted':
        return 'secondary';
      case 'Pending Review':
        return 'outline';
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
    }
  };

  const currentIndex = requests.findIndex(r => r.id === request.id);
  const nextRequest = requests[currentIndex + 1];

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
      {/* Breadcrumb */}
      <div className="border-b bg-background px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push('/wht-requests')}
            className="flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span>{'>'}</span>
          <span>WHT Requests</span>
          <span>{'>'}</span>
          <span className="text-foreground">WHT Request Detail</span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">WHT Request</h1>
            <span className="font-medium">{request.id}</span>
            <Badge variant="secondary" className="text-xs">
              {request.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/wht-requests/${request.id}/attachments`)}
            >
              Attachments
            </Button>
            <Button variant="outline" size="sm">
              Processing Progress
            </Button>
          </div>
        </div>
      </div>

      {/* AI Review Suggestion Bar */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">AI Suggestion:</span>
              <Badge 
                variant={
                  request.aiSuggestion === 'Approve' 
                    ? 'default' 
                    : request.aiSuggestion === 'Reject' 
                    ? 'destructive' 
                    : 'secondary'
                }
                className="text-sm font-medium"
              >
                {request.aiSuggestion}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <span className="text-sm font-semibold">{Math.round(request.aiConfidence * 100)}%</span>
              <Progress value={request.aiConfidence * 100} className="h-2 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Documents:</span>
              <span className="text-sm font-medium">
                {Object.values(request.docsComplete).filter(Boolean).length}/3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Validation Checks:</span>
              <div className="flex items-center gap-2">
                {(showAllValidationChecks ? validationChecks : validationChecks.slice(0, 2)).map((check, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1 rounded-md border bg-background px-2 py-0.5"
                  >
                    {check.passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className="text-xs font-medium">{check.label}</span>
                  </div>
                ))}
                {validationChecks.length > 2 && (
                  <button
                    onClick={() => setShowAllValidationChecks(!showAllValidationChecks)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showAllValidationChecks ? 'Show less' : `+${validationChecks.length - 2} more`}
                  </button>
                )}
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  {passedChecks}/{validationChecks.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden bg-background">
        {/* Left Panel - Request Details */}
        <div className="w-1/2 space-y-4 overflow-auto border-r bg-background p-6 pb-32">
          {/* Document Context Panel - Changes based on active tab */}
          <DocumentContextPanel request={request} activeTab={activeDocTab} />

          {/* AI Review */}
          <AIReviewPanel request={request} />

          {/* Audit Log */}
          <AuditLog entries={request.auditLog} />
        </div>

        {/* Right Panel - Document Viewer */}
        <div className="flex-1 p-6">
          <DocumentViewer request={request} onTabChange={setActiveDocTab} />
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      {request.status !== 'Approved' && request.status !== 'Rejected' && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Next Request */}
            <div>
              {nextRequest && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/wht-requests/${nextRequest.id}`)}
                  className="h-9"
                >
                  Next Request
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Right: Decision Actions */}
            <div className="flex items-center gap-3">
              {/* AI Suggestion - Primary Action */}
              {request.aiSuggestion !== 'Pending Review' && (
                <>
                  <Button
                    onClick={handleAcceptAI}
                    className={`h-9 ${
                      request.aiSuggestion === 'Approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-destructive hover:bg-destructive/90'
                    }`}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept AI Suggestion ({request.aiSuggestion})
                    <span className="ml-2 text-xs opacity-90">
                      {Math.round(request.aiConfidence * 100)}%
                    </span>
                  </Button>
                  <button
                    onClick={() => setShowManualDecision(!showManualDecision)}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Or decide manually {showManualDecision ? '◀' : '▶'}
                  </button>
                </>
              )}

              {/* Manual Decision Options - Collapsible */}
              {(showManualDecision || request.aiSuggestion === 'Pending Review') && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    className="h-9"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject to Requestor
                  </Button>
                  <Button
                    onClick={() => setShowApproveDialog(true)}
                    className="h-9"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
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
