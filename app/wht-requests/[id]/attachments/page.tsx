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
  const leftDoc = 'wht-slip'; // Always fixed to WHT Slip
  const [rightDoc, setRightDoc] = useState('tax-invoice');
  const [leftZoom, setLeftZoom] = useState(100);
  const [rightZoom, setRightZoom] = useState(100);

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

  const getDocument = (docId: string) => documents.find(d => d.id === docId);
  const leftDocument = getDocument(leftDoc);
  const rightDocument = getDocument(rightDoc);

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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Document List */}
        <div className="w-48 border-r bg-background p-4">
          <h3 className="mb-3 text-sm font-medium">Documents</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  if (doc.id !== 'wht-slip') {
                    setRightDoc(doc.id);
                  }
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  leftDoc === doc.id || rightDoc === doc.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{doc.name}</span>
                  {doc.uploaded ? (
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Document Viewers */}
        <div className="flex flex-1">
          {/* Left Viewer - Fixed to WHT Slip */}
          <div className="flex flex-1 flex-col border-r">
            <div className="flex items-center justify-between border-b bg-card px-4 py-3">
              <div className="text-sm font-medium">{leftDocument?.filename}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLeftZoom(Math.max(50, leftZoom - 10))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">{leftZoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLeftZoom(Math.min(200, leftZoom + 10))}
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
              {leftDocument?.uploaded ? (
                <Card className="mx-auto p-8" style={{ width: `${leftZoom}%` }}>
                  <div className="space-y-4 text-sm">
                    <div className="text-center text-lg font-bold">{leftDocument.name}</div>
                    <div className="text-center text-muted-foreground">
                      {leftDocument.filename}
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

          {/* Right Viewer - Tax Invoice or Commercial Invoice */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b bg-card px-4 py-3">
              <Select value={rightDoc} onValueChange={setRightDoc}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documents.filter(doc => doc.id !== 'wht-slip').map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.filename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRightZoom(Math.max(50, rightZoom - 10))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">{rightZoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRightZoom(Math.min(200, rightZoom + 10))}
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
              {rightDocument?.uploaded ? (
                <Card className="mx-auto p-8" style={{ width: `${rightZoom}%` }}>
                  <div className="space-y-4 text-sm">
                    <div className="text-center text-lg font-bold">{rightDocument.name}</div>
                    <div className="text-center text-muted-foreground">
                      {rightDocument.filename}
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
    </div>
  );
}
