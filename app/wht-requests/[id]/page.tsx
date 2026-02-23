'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DocumentViewer } from '@/components/document-viewer';
import { AIReviewPanel } from '@/components/ai-review-panel';
import { AuditLog } from '@/components/audit-log';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
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
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">WHT Request</h1>
            <span className="text-muted-foreground">{'◀'}</span>
            <span className="font-medium">{request.id}</span>
            <Badge variant={getStatusBadgeVariant(request.status)} className="text-xs">
              {request.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Attachments
            </Button>
            <Button variant="outline" size="sm">
              Processing Progress
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Request Details */}
        <div className="w-1/2 space-y-6 overflow-auto border-r p-6 pb-32">
          {/* Request ID Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">{request.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Request ID</p>
                  <p className="text-sm text-primary">{request.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Transaction Type</p>
                  <p className="text-sm">{request.transactionType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Submission Date</p>
                  <p className="text-sm">{formatDate(request.submissionDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Invoice Number</p>
                  <p className="text-sm">{request.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Requestor Email</p>
                  <p className="text-sm">{request.requestorEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Party Type</p>
                  <p className="text-sm">{request.sellerType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-foreground">Company Name</p>
                  <p className="text-sm">{request.companyName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-foreground">
                    {request.usernameShopee ? 'Username Shopee' : 'Merchant Name'}
                  </p>
                  <p className="text-sm">{request.usernameShopee || request.merchantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Requested Amount</p>
                  <p className="text-sm font-semibold">{formatCurrency(request.requestedReimbursementAmount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(request.status)} className="text-xs">
                    {request.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          {(request.shopId || request.merchantId || request.userId) && (
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {request.shopId && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Shop ID</p>
                      <p className="font-mono text-sm">{request.shopId}</p>
                    </div>
                  )}
                  {request.userId && (
                    <div>
                      <p className="text-sm font-medium text-foreground">User ID</p>
                      <p className="font-mono text-sm">{request.userId}</p>
                    </div>
                  )}
                  {request.merchantId && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Merchant ID</p>
                      <p className="font-mono text-sm">{request.merchantId}</p>
                    </div>
                  )}
                  {request.storeId && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Store ID</p>
                      <p className="font-mono text-sm">{request.storeId}</p>
                    </div>
                  )}
                  {request.settleTo && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Settle To</p>
                      <p className="text-sm">{request.settleTo}</p>
                    </div>
                  )}
                  {request.midSid && (
                    <div>
                      <p className="text-sm font-medium text-foreground">MID/SID</p>
                      <p className="font-mono text-sm">{request.midSid}</p>
                    </div>
                  )}
                  {request.approverName && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Approver</p>
                      <p className="text-sm">{request.approverName}</p>
                    </div>
                  )}
                  {request.approvalDate && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Approval Date</p>
                      <p className="text-sm">{formatDate(request.approvalDate)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">Injection Status</p>
                    <Badge variant={request.injectionStatus === 'Done' ? 'default' : 'secondary'} className="text-xs">
                      {request.injectionStatus}
                    </Badge>
                  </div>
                  {request.injectionDate && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Injection Date</p>
                      <p className="text-sm">{formatDate(request.injectionDate)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Review */}
          <AIReviewPanel request={request} />

          {/* Audit Log */}
          <AuditLog entries={request.auditLog} />
        </div>

        {/* Right Panel - Document Viewer */}
        <div className="flex-1 p-6">
          <DocumentViewer request={request} />
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      {request.status !== 'Approved' && request.status !== 'Rejected' && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
            >
              Reject to Requestor
            </Button>
            <div className="flex gap-2">
              {request.aiSuggestion !== 'Pending Review' && (
                <Button
                  variant="outline"
                  onClick={handleAcceptAI}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept AI Suggestion
                </Button>
              )}
              {nextRequest ? (
                <Button onClick={() => router.push(`/wht-requests/${nextRequest.id}`)}>
                  Next Step
                </Button>
              ) : (
                <Button onClick={() => setShowApproveDialog(true)}>
                  Approve
                </Button>
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
