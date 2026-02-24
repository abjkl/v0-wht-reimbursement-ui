'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Bot,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { WHTRequest } from '@/lib/types';

type CheckStatus = 'pass' | 'warn' | 'fail';
type ValidationCheck = {
  section: string;
  label: string;
  status: CheckStatus;
  helper: string;
  reason?: string;
};

interface AIReviewDrawerProps {
  request: WHTRequest;
  validationChecks: ValidationCheck[];
  passedChecks: number;
  warnChecks: number;
  failedChecks: number;
  open: boolean;
  onClose: () => void;
}

export function AIReviewDrawer({
  request,
  validationChecks,
  passedChecks,
  warnChecks,
  failedChecks,
  open,
  onClose,
}: AIReviewDrawerProps) {
  const [isRerunning, setIsRerunning] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const handleRerun = async () => {
    setIsRerunning(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRerunning(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const confidence = Math.round(request.aiConfidence * 100);

  const grouped = validationChecks.reduce((acc, check) => {
    if (!acc[check.section]) acc[check.section] = [];
    acc[check.section].push(check);
    return acc;
  }, {} as Record<string, ValidationCheck[]>);

  const getSectionSummary = (checks: ValidationCheck[]) => {
    const p = checks.filter(c => c.status === 'pass').length;
    const f = checks.filter(c => c.status === 'fail').length;
    const w = checks.filter(c => c.status === 'warn').length;
    if (f > 0) return 'fail';
    if (w > 0) return 'warn';
    return 'pass';
  };

  const suggestionMap: Record<string, { label: string; color: string }> = {
    Approve: { label: 'Accept', color: 'bg-green-600 text-white' },
    Reject: { label: 'Reject', color: 'bg-destructive text-white' },
    'Pending Review': { label: 'Pending Review', color: 'bg-yellow-500 text-white' },
  };

  const suggestion = suggestionMap[request.aiSuggestion] || suggestionMap['Pending Review'];

  if (!open) return null;

  return (
    <div className="flex h-full w-[340px] flex-shrink-0 flex-col border-l bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-none">WHT Slip Review</h3>
            <p className="mt-0.5 text-[10px] text-muted-foreground">AI Agent</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        {/* AI Suggestion */}
        <div className="px-4 py-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">AI Suggestion</p>
          <Badge className={`${suggestion.color} text-sm px-3 py-1`}>
            {suggestion.label}
          </Badge>
        </div>

        <Separator />

        {/* Confidence */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Confidence</p>
            <span className="text-sm font-bold">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>

        <Separator />

        {/* Validation Summary */}
        <div className="px-4 py-4">
          <p className="mb-3 text-xs font-medium text-muted-foreground">Validation Checks</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-medium">{passedChecks}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
              <span className="text-xs font-medium">{warnChecks}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs font-medium">{failedChecks}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              of {validationChecks.length} checks
            </span>
          </div>

          {/* Check Sections - Accordion */}
          <div className="space-y-1">
            {Object.entries(grouped).map(([section, checks]) => {
              const status = getSectionSummary(checks);
              const isExpanded = expandedSections[section] ?? false;

              return (
                <div key={section} className="rounded-md border">
                  <button
                    onClick={() => toggleSection(section)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50"
                  >
                    {status === 'pass' && <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />}
                    {status === 'warn' && <AlertCircle className="h-3.5 w-3.5 text-yellow-600 flex-shrink-0" />}
                    {status === 'fail' && <XCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />}
                    <span className="flex-1 text-xs font-medium">{section}</span>
                    <span className="text-[10px] text-muted-foreground mr-1">
                      {checks.filter(c => c.status === 'pass').length}/{checks.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t px-3 py-2 space-y-1.5 bg-muted/20">
                      {checks.map((check, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {check.status === 'pass' && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                            {check.status === 'warn' && <AlertCircle className="h-3 w-3 text-yellow-600" />}
                            {check.status === 'fail' && <XCircle className="h-3 w-3 text-destructive" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium leading-tight">{check.label}</p>
                            {check.reason && (
                              <p className="text-[10px] text-destructive leading-tight mt-0.5">{check.reason}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer - Rerun */}
      <div className="border-t px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRerun}
          disabled={isRerunning}
          className="w-full gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRerunning ? 'animate-spin' : ''}`} />
          {isRerunning ? 'Running...' : 'Re-run Agent'}
        </Button>
      </div>
    </div>
  );
}
