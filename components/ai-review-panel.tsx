'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { WHTRequest } from '@/lib/types';

interface AIReviewPanelProps {
  request: WHTRequest;
}

export function AIReviewPanel({ request }: AIReviewPanelProps) {
  const checks = [
    {
      label: 'Document Completeness',
      passed: request.docsComplete.invoice && request.docsComplete.taxInvoice && request.docsComplete.whtSlip,
      details: `${Object.values(request.docsComplete).filter(Boolean).length}/3 documents provided`
    },
    {
      label: 'Invoice Number Present',
      passed: !!request.invoiceNumber,
      details: request.invoiceNumber ? 'Valid invoice number' : 'Missing invoice number'
    },
    {
      label: 'Amount Validation',
      passed: request.requestedReimbursementAmount > 0,
      details: request.requestedReimbursementAmount > 0 ? 'Valid amount' : 'Invalid amount'
    },
    {
      label: 'Company Information',
      passed: !!request.companyName,
      details: request.companyName ? 'Company name provided' : 'Missing company name'
    }
  ];

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

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Validation Checks</p>
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {check.passed ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              )}
              <div className="flex-1 space-y-0.5">
                <p className="text-sm">{check.label}</p>
                <p className="text-xs text-muted-foreground">{check.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
