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
              <TableHead className="w-[150px]">Shopee Username</TableHead>
              <TableHead className="w-[180px]">Seller/Merchant Name</TableHead>
              <TableHead className="w-[150px] text-right">Requested Amount</TableHead>
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
                    <Badge variant={getAISuggestionBadgeVariant(req.aiSuggestion)} className="text-xs">
                      {req.aiSuggestion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(req.status)} className="text-xs">
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
