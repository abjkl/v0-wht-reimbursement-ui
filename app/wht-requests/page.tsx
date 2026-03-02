'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { filterRequests } from '@/lib/filter-utils';
import { FiltersBar } from '@/components/filters-bar';
import { RequestsTable } from '@/components/requests-table';
import { Button } from '@/components/ui/button';

export default function WHTRequestsPage() {
  const { requests, filters } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'in-preparation' | 'pending-review' | 'approved' | 'rejected'>('all');

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
        <RequestsTable requests={displayRequests} />
      </div>
    </div>
  );
}
