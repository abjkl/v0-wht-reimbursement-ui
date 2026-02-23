'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      uploaded: request.docsComplete.whtSlip,
      zoom: zoom1,
      setZoom: setZoom1
    },
    {
      id: 'tax-invoice',
      name: 'Tax Invoice',
      filename: `Tax_Invoice_${request.id}.pdf`,
      url: request.taxInvoiceUrl,
      uploaded: request.docsComplete.taxInvoice,
      zoom: zoom2,
      setZoom: setZoom2
    },
    {
      id: 'shopee-invoice',
      name: 'Shopee Invoice',
      filename: `Shopee_Invoice_${request.id}.pdf`,
      url: request.invoiceUrl,
      uploaded: request.docsComplete.invoice,
      zoom: zoom3,
      setZoom: setZoom3
    }
  ];

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

      {/* Main Content - 3 Documents Side by Side */}
      <div className="flex flex-1 overflow-hidden">
        {documents.map((doc, index) => (
          <div key={doc.id} className={`flex flex-1 flex-col ${index < 2 ? 'border-r' : ''}`}>
            {/* Document Header */}
            <div className="flex items-center justify-between border-b bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{doc.name}</span>
                {doc.uploaded && (
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => doc.setZoom(Math.max(50, doc.zoom - 10))}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="min-w-[50px] text-center text-xs text-muted-foreground">
                  {doc.zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => doc.setZoom(Math.min(200, doc.zoom + 10))}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Printer className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-auto bg-muted/30 p-4">
              {doc.uploaded ? (
                <Card className="mx-auto p-6" style={{ width: `${doc.zoom}%` }}>
                  <div className="space-y-4 text-sm">
                    <div className="text-center text-base font-bold">{doc.name}</div>
                    <div className="text-center text-xs text-muted-foreground">
                      {doc.filename}
                    </div>
                    <div className="rounded border bg-muted/50 p-8 text-center text-muted-foreground">
                      Document preview placeholder
                      <br />
                      <span className="text-xs">In production, PDF would be displayed here</span>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Document not uploaded
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
