'use client';

import { useCallback, useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { filterRequests } from '@/lib/filter-utils';
import { FiltersBar } from '@/components/filters-bar';
import { RequestsTable } from '@/components/requests-table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function WHTRequestsPage() {
  const { requests, filters, updateRequest } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'in-preparation' | 'pending-review' | 'approved' | 'rejected'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleBatchApprove = useCallback(() => {
    selectedIds.forEach(id => {
      updateRequest(id, { status: 'Approved' });
    });
    setSelectedIds(new Set());
  }, [selectedIds, updateRequest]);

  const handleBatchReject = useCallback(() => {
    selectedIds.forEach(id => {
      updateRequest(id, { status: 'Rejected' });
    });
    setSelectedIds(new Set());
  }, [selectedIds, updateRequest]);

  const inPreparation = useMemo(
    () => requests.filter(r => r.status === 'Submitted'),
    [requests]
  );

  const pendingReview = useMemo(
    () => requests.filter(r => r.status === 'Pending Review'),
    [requests]
  );

  const approved = useMemo(
    () => requests.filter(r => r.status === 'Approved'),
    [requests]
  );

  const rejected = useMemo(
    () => requests.filter(r => r.status === 'Rejected'),
    [requests]
  );

  const getDisplayRequests = () => {
    switch (activeTab) {
      case 'in-preparation':
        return filterRequests(inPreparation, { ...filters, status: 'All' });
      case 'pending-review':
        return filterRequests(pendingReview, { ...filters, status: 'All' });
      case 'approved':
        return filterRequests(approved, { ...filters, status: 'All' });
      case 'rejected':
        return filterRequests(rejected, { ...filters, status: 'All' });
      case 'all':
      default:
        return filterRequests(requests, filters);
    }
  };

  const displayRequests = getDisplayRequests();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="text-2xl font-semibold">WHT Reimbursement Requests</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Filter Section */}
        <div className="mb-6 space-y-4">
          <h2 className="text-sm font-medium">Filter</h2>
          <FiltersBar />
        </div>

        {/* Status Tabs */}
        <div className="mb-6 flex items-center gap-6 border-b">
          {([
            { key: 'all', label: 'All', count: requests.length },
            { key: 'in-preparation', label: 'In Preparation', count: inPreparation.length },
            { key: 'pending-review', label: 'Pending Review', count: pendingReview.length },
            { key: 'approved', label: 'Approved', count: approved.length },
            { key: 'rejected', label: 'Rejected', count: rejected.length },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} <span className="ml-1 text-muted-foreground">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Table Header Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm">
            Total: <span className="font-medium">{displayRequests.length}</span> WHT Request/s
          </p>
        </div>

        {/* Table */}
        <RequestsTable
          requests={displayRequests}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-card shadow-lg">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3">
            <span className="text-sm text-muted-foreground">
              Selected <span className="font-semibold text-foreground">{selectedIds.size}</span> request(s)
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleBatchReject}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Batch Reject
              </Button>
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={handleBatchApprove}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Batch Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
