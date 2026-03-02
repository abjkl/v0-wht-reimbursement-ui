'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/filter-utils';
import type { WHTRequest } from '@/lib/types';

interface RequestsTableProps {
  requests: WHTRequest[];
}

export function RequestsTable({ requests }: RequestsTableProps) {
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

  const getAISuggestionStyle = (suggestion: WHTRequest['aiSuggestion']) => {
    switch (suggestion) {
      case 'Approve':
        return { dot: 'bg-emerald-500', text: 'text-emerald-700' };
      case 'Reject':
        return { dot: 'bg-red-500', text: 'text-red-700' };
      case 'Pending Review':
        return { dot: 'bg-amber-400', text: 'text-amber-700' };
    }
  };

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
              <TableHead className="w-[120px]">Submission Date</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[150px]">Username</TableHead>
              <TableHead className="w-[180px]">Company Name</TableHead>
              <TableHead className="w-[180px] text-right">WHT.23 Reimbursement Amount</TableHead>
              <TableHead className="w-[120px]">AI Suggestion</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
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
                  <TableCell className="text-sm">{req.usernameShopee || req.merchantName || '\u2014'}</TableCell>
                  <TableCell className="text-sm">{req.sellerCompanyName || req.syncedCompanyName || '\u2014'}</TableCell>
                  <TableCell className="text-right text-sm">
                    {formatCurrency(req.requestedReimbursementAmount)}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const style = getAISuggestionStyle(req.aiSuggestion);
                      return (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                          <span className={style.text}>{req.aiSuggestion}</span>
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-medium ${
                        req.status === 'Approved'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : req.status === 'Rejected'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : req.status === 'Pending Review'
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-border bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/wht-requests/${req.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Review
                    </Link>
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
