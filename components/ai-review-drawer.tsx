'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronRight,
  PanelRightClose,
  Check,
  X,
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
  onApprove: () => void;
  onReject: () => void;
}

export function AIReviewDrawer({
  request,
  validationChecks,
  passedChecks,
  warnChecks,
  failedChecks,
  open,
  onClose,
  onApprove,
  onReject,
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

  const getSectionStatus = (checks: ValidationCheck[]) => {
    const f = checks.filter(c => c.status === 'fail').length;
    const w = checks.filter(c => c.status === 'warn').length;
    if (f > 0) return 'fail';
    if (w > 0) return 'warn';
    return 'pass';
  };

  const getSectionBadge = (checks: ValidationCheck[]) => {
    const status = getSectionStatus(checks);
    const f = checks.filter(c => c.status === 'fail').length;
    const w = checks.filter(c => c.status === 'warn').length;
    if (status === 'fail') {
      return (
        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
          {f} Failed
        </span>
      );
    }
    if (status === 'warn') {
      return (
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
          {w} Warning{w > 1 ? 's' : ''}
        </span>
      );
    }
    return (
      <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
        All Passed
      </span>
    );
  };

  if (!open) return null;

  return (
    <div className="flex h-full w-[360px] flex-shrink-0 flex-col border-l bg-card">
      {/* Header */}
      <div className="border-b px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-tight">AI Assistant</h3>
              <p className="text-[11px] text-muted-foreground">WHT Slip Review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        {/* Validation Checks Section */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Validation Checks
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-0.5 text-green-600 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                {passedChecks}
              </span>
              <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                <AlertCircle className="h-3 w-3" />
                {warnChecks}
              </span>
              <span className="flex items-center gap-0.5 text-red-600 font-medium">
                <XCircle className="h-3 w-3" />
                {failedChecks}
              </span>
            </div>
          </div>

          {/* Section Accordion Cards */}
          <div className="space-y-2">
            {Object.entries(grouped).map(([section, checks]) => {
              const isExpanded = expandedSections[section] ?? false;
              const sectionStatus = getSectionStatus(checks);
              const borderColor =
                sectionStatus === 'fail'
                  ? 'border-red-200'
                  : sectionStatus === 'warn'
                  ? 'border-amber-200'
                  : 'border-green-200';

              return (
                <div
                  key={section}
                  className={`rounded-lg border ${borderColor} overflow-hidden`}
                >
                  <button
                    onClick={() => toggleSection(section)}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/30"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="flex-1 text-xs font-semibold">{section}</span>
                    {getSectionBadge(checks)}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-dashed px-3 py-2.5 space-y-2 bg-muted/10">
                      {checks.map((check, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 rounded-md px-2.5 py-2 text-[11px] ${
                            check.status === 'fail'
                              ? 'bg-red-50 border border-red-100'
                              : check.status === 'warn'
                              ? 'bg-amber-50 border border-amber-100'
                              : ''
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {check.status === 'pass' && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                            {check.status === 'warn' && <AlertCircle className="h-3.5 w-3.5 text-amber-600" />}
                            {check.status === 'fail' && <XCircle className="h-3.5 w-3.5 text-red-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium leading-tight">{check.label}</p>
                            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{check.helper}</p>
                            {check.reason && (
                              <p className="text-[10px] leading-snug mt-1 font-medium text-red-700">
                                {check.reason}
                              </p>
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

        {/* Re-run Button */}
        <div className="px-5 py-3">
          <button
            onClick={handleRerun}
            disabled={isRerunning}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${isRerunning ? 'animate-spin' : ''}`} />
            {isRerunning ? 'Running...' : 'Re-run checks'}
          </button>
        </div>

        {/* Final AI Decision */}
        <div className="mx-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold">Final AI Decision</span>
          </div>
          <div
            className={`rounded-lg border p-4 ${
              request.aiSuggestion === 'Approve'
                ? 'border-green-200 bg-green-50'
                : request.aiSuggestion === 'Reject'
                ? 'border-red-200 bg-red-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {request.aiSuggestion === 'Approve' && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              {request.aiSuggestion === 'Reject' && (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              {request.aiSuggestion === 'Review' && (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              <span
                className={`text-sm font-bold ${
                  request.aiSuggestion === 'Approve'
                    ? 'text-green-800'
                    : request.aiSuggestion === 'Reject'
                    ? 'text-red-800'
                    : 'text-amber-800'
                }`}
              >
                {request.aiSuggestion === 'Approve'
                  ? 'Approve'
                  : request.aiSuggestion === 'Reject'
                  ? 'Reject to Requestor'
                  : 'Pending Review'}
              </span>
            </div>

            {/* Confidence bar */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-muted-foreground w-16">Confidence</span>
              <Progress value={confidence} className="h-1.5 flex-1" />
              <span className="text-[11px] font-bold w-8 text-right">{confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Actions */}
      <div className="border-t px-5 py-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={onApprove}
            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-3.5 w-3.5" />
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
