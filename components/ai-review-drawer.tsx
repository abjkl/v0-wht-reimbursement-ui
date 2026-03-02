'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  PanelRightClose,
  Check,
  X,
  Circle,
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
  onCheckDetails?: () => void;
  onNotAcceptAI?: (incorrectChecks: string[], notes: string) => void;
}

// --- Agent Card Component ---
function AgentCard({
  name,
  conclusion,
  confidence,
  validationChecks,
  passedChecks,
  warnChecks,
  failedChecks,
  accepted,
  onAccept,
  onNotAccept,
  onRerun,
  isRerunning,
  onCheckDetails,
}: {
  name: string;
  conclusion: 'Approve' | 'Reject' | 'Review';
  confidence: number;
  validationChecks: ValidationCheck[];
  passedChecks: number;
  warnChecks: number;
  failedChecks: number;
  accepted: boolean | null;
  onAccept: () => void;
  onNotAccept: () => void;
  onRerun: () => void;
  isRerunning: boolean;
  onCheckDetails?: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const grouped = validationChecks.reduce((acc, check) => {
    if (!acc[check.section]) acc[check.section] = [];
    acc[check.section].push(check);
    return acc;
  }, {} as Record<string, ValidationCheck[]>);

  const conclusionConfig = {
    Approve: {
      label: 'Approve',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      dot: 'bg-green-500',
    },
    Reject: {
      label: 'Reject to Requestor',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      dot: 'bg-red-500',
    },
    Review: {
      label: 'Pending Review',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    'Pending Review': {
      label: 'Pending Review',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
    },
  };
  const cfg = conclusionConfig[conclusion] || conclusionConfig.Review;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Agent Header - clickable to expand/collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        {/* Status circle */}
        {accepted === true ? (
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
        ) : accepted === false ? (
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
        )}
        <span className="flex-1 text-sm font-semibold">{name}</span>
        {/* Conclusion badge with confidence */}
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {conclusion === 'Approve' ? 'Approve' : conclusion === 'Reject' ? 'Reject' : 'Pending'}
          <span className="text-[9px] font-medium opacity-70">{confidence}%</span>
        </span>
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t">
          {/* Re-run */}
          <div className="flex justify-end px-4 pb-1">
            <button
              onClick={(e) => { e.stopPropagation(); onRerun(); }}
              disabled={isRerunning}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${isRerunning ? 'animate-spin' : ''}`} />
              Re-run
            </button>
          </div>

          {/* Part 2: Supporting Details */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Details
              </span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-green-600 font-semibold">{passedChecks}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-amber-600 font-semibold">{warnChecks}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-red-600 font-semibold">{failedChecks}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {Object.entries(grouped).map(([section, checks]) => {
                const isOpen = expandedSections[section] ?? false;
                const hasFail = checks.some(c => c.status === 'fail');
                const hasWarn = checks.some(c => c.status === 'warn');
                const borderColor = hasFail ? 'border-red-200' : hasWarn ? 'border-amber-200' : 'border-green-200';
                const bgColor = hasFail ? 'bg-red-50/50' : hasWarn ? 'bg-amber-50/50' : '';

                return (
                  <div key={section} className={`rounded-lg border ${borderColor} overflow-hidden`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSection(section); }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors ${bgColor}`}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="flex-1 text-[11px] font-semibold">{section}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {checks.filter(c => c.status === 'pass').length}/{checks.length}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-dashed px-3 py-2 space-y-1.5">
                        {checks.map((check, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-[11px]"
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {check.status === 'pass' && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                              {check.status === 'warn' && <AlertCircle className="h-3 w-3 text-amber-500" />}
                              {check.status === 'fail' && <XCircle className="h-3 w-3 text-red-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium leading-tight">{check.label}</span>
                              {check.reason && (
                                <p className="text-[10px] text-red-600 mt-0.5 italic">{check.reason}</p>
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

          {/* Part 3: User Action */}
          {accepted === null && (
            <div className="border-t px-4 py-3">
              {(conclusion === 'Review' || conclusion === 'Pending Review') ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(true); onCheckDetails?.(); }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Check Details
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onNotAccept(); }}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-muted-foreground/20 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Not Accept
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAccept(); }}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Accept
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Accepted / Not Accepted state */}
          {accepted !== null && (
            <div className="border-t px-4 py-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                accepted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {accepted ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                {accepted ? 'Accepted' : 'Not Accepted'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Main Drawer ---
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
  onCheckDetails,
  onNotAcceptAI,
}: AIReviewDrawerProps) {
  const [isRerunning, setIsRerunning] = useState(false);
  const [agentAccepted, setAgentAccepted] = useState<boolean | null>(null);
  const [showNotAcceptDialog, setShowNotAcceptDialog] = useState(false);
  const [incorrectChecks, setIncorrectChecks] = useState<string[]>([]);
  const [notAcceptNotes, setNotAcceptNotes] = useState('');

  const handleNotAcceptOpen = () => {
    setIncorrectChecks([]);
    setNotAcceptNotes('');
    setShowNotAcceptDialog(true);
  };

  const handleNotAcceptConfirm = () => {
    setAgentAccepted(false);
    onNotAcceptAI?.(incorrectChecks, notAcceptNotes);
    setShowNotAcceptDialog(false);
    setIncorrectChecks([]);
    setNotAcceptNotes('');
  };

  const handleRerun = async () => {
    setIsRerunning(true);
    setAgentAccepted(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRerunning(false);
  };

  const confidence = Math.round(request.aiConfidence * 100);
  const totalAgents = 1; // Extensible: add more agents in future
  const confirmedAgents = agentAccepted !== null ? 1 : 0;

  if (!open) return null;

  return (
    <div className="flex h-full w-[340px] flex-shrink-0 flex-col border-l bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">AI Review</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Required Tasks
        </span>
        <span className="text-[11px] text-muted-foreground">
          {confirmedAgents}/{totalAgents} confirmed
        </span>
      </div>

      {/* Scrollable Agent Cards */}
      <div className="flex-1 overflow-auto px-4 pb-4 space-y-3 bg-muted/10">
        {/* Agent 1: WHT Slip Review */}
        <AgentCard
          name="WHT Slip Review"
          conclusion={request.aiSuggestion as 'Approve' | 'Reject' | 'Review'}
          confidence={confidence}
          validationChecks={validationChecks}
          passedChecks={passedChecks}
          warnChecks={warnChecks}
          failedChecks={failedChecks}
          accepted={agentAccepted}
          onAccept={() => setAgentAccepted(true)}
          onNotAccept={handleNotAcceptOpen}
  onCheckDetails={onCheckDetails}
          onRerun={handleRerun}
          isRerunning={isRerunning}
        />

        {/* Future agents can be added here */}
      </div>

      {/* Not Accept Dialog */}
      <Dialog open={showNotAcceptDialog} onOpenChange={setShowNotAcceptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Not Accept AI Suggestion</DialogTitle>
            <DialogDescription>
              Please select which AI check item(s) you believe are incorrect.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="max-h-[320px] overflow-auto space-y-2 pr-1">
              {validationChecks.map((check, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${
                    incorrectChecks.includes(check.label)
                      ? 'border-red-300 bg-red-50/50'
                      : 'border-border hover:bg-muted/30'
                  }`}
                >
                  <Checkbox
                    id={`notaccept-${idx}`}
                    checked={incorrectChecks.includes(check.label)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIncorrectChecks([...incorrectChecks, check.label]);
                      } else {
                        setIncorrectChecks(incorrectChecks.filter(l => l !== check.label));
                      }
                    }}
                    className="mt-0.5"
                  />
                  <label htmlFor={`notaccept-${idx}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        {check.status === 'pass' && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                        {check.status === 'warn' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                        {check.status === 'fail' && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                      </div>
                      <span className="text-sm font-medium">{check.label}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground pl-5.5">{check.helper}</p>
                  </label>
                </div>
              ))}
            </div>
            <Textarea
              placeholder="Additional notes (optional)..."
              value={notAcceptNotes}
              onChange={(e) => setNotAcceptNotes(e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotAcceptDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleNotAcceptConfirm}
              disabled={incorrectChecks.length === 0}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
