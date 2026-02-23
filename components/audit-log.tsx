'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AuditLogEntry } from '@/lib/types';

interface AuditLogProps {
  entries: AuditLogEntry[];
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year}, ${hours}.${minutes}`;
}

export function AuditLog({ entries }: AuditLogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <div key={idx}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {mounted ? formatTimestamp(entry.timestamp) : '—'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{entry.actor}</p>
                {entry.details && (
                  <p className="text-xs text-muted-foreground italic">{entry.details}</p>
                )}
              </div>
              {idx < entries.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
