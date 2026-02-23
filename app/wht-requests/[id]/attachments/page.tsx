'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ZoomIn, ZoomOut, Download, ExternalLink, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AttachmentsPage() {
  const params = useParams();
  const router = useRouter();
  const { requests } = useStore();
  const [zoom1, setZoom1] = useState(100);
  const [zoom2, setZoom2] = useState(100);
  const [zoom3, setZoom3] = useState(100);

  const request = requests.find(r => r.id === params.id);

  if (!request) {
    return <div>Request not found</div>;
  }

  const documents = [
    {
      id: 'wht-slip',
      name: 'WHT Slip',
      filename: `WHT_Slip_${request.id}.pdf`,
      url: request.whtSlipUrl,
      uploaded: request.docsComplete.whtSlip
    },
    {
      id: 'tax-invoice',
      name: 'Tax Invoice',
      filename: `Tax_Invoice_${request.id}.pdf`,
      url: request.taxInvoiceUrl,
      uploaded: request.docsComplete.taxInvoice
    },
    {
      id: 'shopee-invoice',
      name: 'Shopee Invoice',
      filename: `Shopee_Invoice_${request.id}.pdf`,
      url: request.invoiceUrl,
      uploaded: request.docsComplete.invoice
    }
  ];

  const doc1 = documents[0]; // WHT Slip
  const doc2 = documents[1]; // Tax Invoice
  const doc3 = documents[2]; // Shopee Invoice

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push('/wht-requests')}
            className="hover:text-foreground"
          >
            WHT Requests
          </button>
          <span>{'>'}</span>
          <button
            onClick={() => router.push(`/wht-requests/${request.id}`)}
            className="hover:text-foreground"
          >
            {request.id}
          </button>
          <span>{'>'}</span>
          <span className="text-foreground">Attachments</span>
        </div>
      </div>

      {/* Title Bar */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/wht-requests/${request.id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Attachments ({request.id})</h1>
            <Badge variant="secondary">
              {documents.filter(d => d.uploaded).length}/{documents.length} Uploaded
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Three Document Viewers */}
      <div className="flex flex-1 overflow-hidden">
        {/* Viewer 1 - WHT Slip */}
        <div className="flex flex-1 flex-col border-r">
          <div className="flex items-center justify-between border-b bg-card px-4 py-3">
            <div className="text-sm font-medium">{doc1.filename}</div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom1(Math.max(50, zoom1 - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{zoom1}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom1(Math.min(200, zoom1 + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-muted/30 p-6">
            {doc1.uploaded ? (
              <Card className="mx-auto p-8" style={{ width: `${zoom1}%` }}>
                <div className="space-y-4 text-sm">
                  <div className="text-center text-lg font-bold">{doc1.name}</div>
                  <div className="text-center text-muted-foreground">
                    {doc1.filename}
                  </div>
                  <div className="rounded border bg-muted/50 p-4 text-center text-muted-foreground">
                    Document preview placeholder
                    <br />
                    <span className="text-xs">In production, PDF would be displayed here</span>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Document not uploaded
              </div>
            )}
          </div>
        </div>

        {/* Viewer 2 - Tax Invoice */}
        <div className="flex flex-1 flex-col border-r">
          <div className="flex items-center justify-between border-b bg-card px-4 py-3">
            <div className="text-sm font-medium">{doc2.filename}</div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom2(Math.max(50, zoom2 - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{zoom2}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom2(Math.min(200, zoom2 + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-muted/30 p-6">
            {doc2.uploaded ? (
              <Card className="mx-auto p-8" style={{ width: `${zoom2}%` }}>
                <div className="space-y-4 text-sm">
                  <div className="text-center text-lg font-bold">{doc2.name}</div>
                  <div className="text-center text-muted-foreground">
                    {doc2.filename}
                  </div>
                  <div className="rounded border bg-muted/50 p-4 text-center text-muted-foreground">
                    Document preview placeholder
                    <br />
                    <span className="text-xs">In production, PDF would be displayed here</span>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Document not uploaded
              </div>
            )}
          </div>
        </div>

        {/* Viewer 3 - Shopee Invoice */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b bg-card px-4 py-3">
            <div className="text-sm font-medium">{doc3.filename}</div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom3(Math.max(50, zoom3 - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{zoom3}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom3(Math.min(200, zoom3 + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-muted/30 p-6">
            {doc3.uploaded ? (
              <Card className="mx-auto p-8" style={{ width: `${zoom3}%` }}>
                <div className="space-y-4 text-sm">
                  <div className="text-center text-lg font-bold">{doc3.name}</div>
                  <div className="text-center text-muted-foreground">
                    {doc3.filename}
                  </div>
                  <div className="rounded border bg-muted/50 p-4 text-center text-muted-foreground">
                    Document preview placeholder
                    <br />
                    <span className="text-xs">In production, PDF would be displayed here</span>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Document not uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
