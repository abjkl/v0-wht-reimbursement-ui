'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, FileCheck, FileX } from 'lucide-react';
import { formatCurrency, formatDate, getDocCompletionCount } from '@/lib/filter-utils';
import type { WHTRequest } from '@/lib/types';

interface RequestsTableProps {
  requests: WHTRequest[];
}

export function RequestsTable({ requests }: RequestsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const getStatusBadgeVariant = (status: WHTRequest['status']) => {
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

  const getAISuggestionBadgeVariant = (suggestion: WHTRequest['aiSuggestion']) => {
    switch (suggestion) {
      case 'Approve':
        return 'default';
      case 'Reject':
        return 'destructive';
      case 'Pending Review':
        return 'secondary';
    }
  };

  const getInjectionBadgeVariant = (status: WHTRequest['injectionStatus']) => {
    switch (status) {
      case 'Done':
        return 'default';
      case 'Not Started':
        return 'secondary';
      case 'Failed':
        return 'destructive';
    }
  };

  const DocIcon = ({ complete }: { complete: boolean }) =>
    complete ? (
      <FileCheck className="h-4 w-4 text-green-500" />
    ) : (
      <FileX className="h-4 w-4 text-muted-foreground" />
    );

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]">
                <input type="checkbox" className="rounded border" />
              </TableHead>
              <TableHead className="w-[140px]">Request ID</TableHead>
              <TableHead className="w-[110px]">Submission Date</TableHead>
              <TableHead className="w-[180px]">Requestor Email</TableHead>
              <TableHead className="w-[140px]">Transaction Type</TableHead>
              <TableHead className="w-[140px]">Invoice Number</TableHead>
              <TableHead className="w-[120px] text-right">Amount</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px]">AI Suggestion</TableHead>
              <TableHead className="w-[100px]">Injection</TableHead>
              <TableHead className="w-[80px]">Docs</TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-32 text-center text-muted-foreground">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/30">
                  <TableCell>
                    <input type="checkbox" className="rounded border" />
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <Link href={`/wht-requests/${req.id}`} className="text-primary hover:underline">
                      {req.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(req.submissionDate)}</TableCell>
                  <TableCell className="text-sm">{req.requestorEmail}</TableCell>
                  <TableCell className="text-sm">{req.transactionType}</TableCell>
                  <TableCell className="font-mono text-sm">{req.invoiceNumber}</TableCell>
                  <TableCell className="text-right text-sm">
                    {formatCurrency(req.requestedReimbursementAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(req.status)} className="text-xs">
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getAISuggestionBadgeVariant(req.aiSuggestion)} className="text-xs">
                        {req.aiSuggestion === 'Approve' ? 'Approve' : req.aiSuggestion === 'Reject' ? 'Reject' : 'Review'}
                      </Badge>
                      {req.aiConfidence > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(req.aiConfidence * 100)}%
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getInjectionBadgeVariant(req.injectionStatus)} className="text-xs">
                      {req.injectionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger>
                            <DocIcon complete={req.docsComplete.whtSlip} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>WHT Slip {req.docsComplete.whtSlip ? '✓' : '✗'}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <DocIcon complete={req.docsComplete.taxInvoice} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tax Invoice {req.docsComplete.taxInvoice ? '✓' : '✗'}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <DocIcon complete={req.docsComplete.invoice} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Invoice {req.docsComplete.invoice ? '✓' : '✗'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link href={`/wht-requests/${req.id}`} className="text-sm text-primary hover:underline">
                        Review
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      </Table>
    </div>
  );
}
