'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileCheck, FileX } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/filter-utils';
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
              <TableHead className="w-[130px]">Submission Date</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[160px]">Username Toko Shopee</TableHead>
              <TableHead className="w-[180px]">Nama Perusahaan</TableHead>
              <TableHead className="w-[140px]">Invoice Number</TableHead>
              <TableHead className="w-[140px] text-right">Requested Amount (IDR)</TableHead>
              <TableHead className="w-[80px]">Docs</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">AI Suggestion</TableHead>
              <TableHead className="w-[100px]">AI Confidence</TableHead>
              <TableHead className="w-[140px]">Approver</TableHead>
              <TableHead className="w-[120px]">Approval Date</TableHead>
              <TableHead className="w-[120px]">Injection Status</TableHead>
              <TableHead className="w-[120px]">Injection Date</TableHead>
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
                <TableRow key={req.id} className="hover:bg-muted/30">
                  <TableCell>
                    <input type="checkbox" className="rounded border" />
                  </TableCell>
                  {/* Seller-submitted fields first */}
                  <TableCell className="font-mono text-sm">
                    <Link href={`/wht-requests/${req.id}`} className="text-primary hover:underline">
                      {req.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(req.submissionDate)}</TableCell>
                  <TableCell className="text-sm">{req.requestorEmail}</TableCell>
                  <TableCell className="text-sm">{req.usernameShopee || req.merchantName || '—'}</TableCell>
                  <TableCell className="text-sm">
                    {req.sellerCompanyName || req.syncedCompanyName || '—'}
                    {!req.sellerCompanyName && req.syncedCompanyName && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        synced
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{req.invoiceNumber}</TableCell>
                  <TableCell className="text-right text-sm">
                    {formatCurrency(req.requestedReimbursementAmount)}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger>
                            <DocIcon complete={req.docsComplete.invoice} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Shopee Invoice {req.docsComplete.invoice ? 'uploaded' : 'missing'}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <DocIcon complete={req.docsComplete.taxInvoice} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tax Invoice {req.docsComplete.taxInvoice ? 'uploaded' : 'missing'}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <DocIcon complete={req.docsComplete.whtSlip} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>WHT Slip {req.docsComplete.whtSlip ? 'uploaded' : 'missing'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                  {/* System-generated fields */}
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(req.status)} className="text-xs">
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getAISuggestionBadgeVariant(req.aiSuggestion)} className="text-xs">
                      {req.aiSuggestion}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {req.aiConfidence > 0 ? `${Math.round(req.aiConfidence * 100)}%` : '—'}
                  </TableCell>
                  <TableCell className="text-sm">{req.approverName || '—'}</TableCell>
                  <TableCell className="text-sm">
                    {req.approvalDate ? formatDate(req.approvalDate) : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getInjectionBadgeVariant(req.injectionStatus)} className="text-xs">
                      {req.injectionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {req.injectionDate ? formatDate(req.injectionDate) : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
