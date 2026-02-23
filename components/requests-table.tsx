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
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">Request ID</TableHead>
            <TableHead className="w-[110px]">Submission</TableHead>
            <TableHead className="w-[200px]">Requestor</TableHead>
            <TableHead className="w-[140px]">Type</TableHead>
            <TableHead className="w-[100px]">Party</TableHead>
            <TableHead className="min-w-[180px]">Company</TableHead>
            <TableHead className="min-w-[150px]">Name/Shop</TableHead>
            <TableHead className="w-[140px]">Invoice #</TableHead>
            <TableHead className="w-[140px] text-right">Amount</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead className="w-[140px]">AI</TableHead>
            <TableHead className="w-[180px]">Approver</TableHead>
            <TableHead className="w-[110px]">Approved</TableHead>
            <TableHead className="w-[110px]">Injection</TableHead>
            <TableHead className="w-[110px]">Injected</TableHead>
            <TableHead className="w-[80px]">Docs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={16} className="h-32 text-center text-muted-foreground">
                No requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id} className="cursor-pointer">
                <TableCell className="font-mono text-xs">
                  <Link href={`/wht-requests/${req.id}`} className="text-primary hover:underline">
                    {req.id}
                  </Link>
                </TableCell>
                <TableCell className="text-xs">{formatDate(req.submissionDate)}</TableCell>
                <TableCell className="text-xs">{req.requestorEmail}</TableCell>
                <TableCell className="text-xs">{req.transactionType}</TableCell>
                <TableCell className="text-xs">{req.sellerType}</TableCell>
                <TableCell className="text-xs">{req.companyName}</TableCell>
                <TableCell className="text-xs">
                  {req.usernameShopee || req.merchantName || '—'}
                </TableCell>
                <TableCell className="font-mono text-xs">{req.invoiceNumber}</TableCell>
                <TableCell className="text-right text-xs">
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
                    <span className="text-xs text-muted-foreground">
                      {Math.round(req.aiConfidence * 100)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{req.approverName || '—'}</TableCell>
                <TableCell className="text-xs">
                  {req.approvalDate ? formatDate(req.approvalDate) : '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={getInjectionBadgeVariant(req.injectionStatus)} className="text-xs">
                    {req.injectionStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {req.injectionDate ? formatDate(req.injectionDate) : '—'}
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
