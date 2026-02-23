'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, ZoomIn, ZoomOut, FileX } from 'lucide-react';
import type { WHTRequest } from '@/lib/types';

interface DocumentViewerProps {
  request: WHTRequest;
  onTabChange?: (tab: string) => void;
}

export function DocumentViewer({ request, onTabChange }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState('wht-slip');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  const docs = [
    {
      id: 'wht-slip',
      label: 'WHT Slip',
      url: request.whtSlipUrl,
      available: request.docsComplete.whtSlip
    },
    {
      id: 'tax-invoice',
      label: 'Tax Invoice',
      url: request.taxInvoiceUrl,
      available: request.docsComplete.taxInvoice
    },
    {
      id: 'invoice',
      label: 'Shopee Invoice',
      url: request.invoiceUrl,
      available: request.docsComplete.invoice
    }
  ];

  const currentDoc = docs.find(d => d.id === activeTab);

  return (
    <Card className="flex h-full flex-col bg-muted/30">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <TabsList>
            {docs.map(doc => (
              <TabsTrigger key={doc.id} value={doc.id} disabled={!doc.available}>
                {doc.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {currentDoc?.available && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.min(200, zoom + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {currentDoc.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(currentDoc.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {docs.map(doc => (
          <TabsContent
            key={doc.id}
            value={doc.id}
            className="flex-1 overflow-hidden p-0 data-[state=active]:flex"
          >
            {doc.available && doc.url ? (
              <div className="flex h-full w-full items-center justify-center overflow-auto bg-muted/20 p-4">
                {doc.url.endsWith('.pdf') ? (
                  <iframe
                    src={doc.url}
                    className="h-full w-full rounded border bg-white"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                  />
                ) : (
                  <img
                    src={doc.url}
                    alt={doc.label}
                    className="max-h-full max-w-full rounded object-contain"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
                <FileX className="h-16 w-16" />
                <div className="text-center">
                  <p className="text-lg font-medium">Document Not Provided</p>
                  <p className="text-sm">This document was not uploaded with the request</p>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
