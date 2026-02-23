'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { filterRequests } from '@/lib/filter-utils';
import { FiltersBar } from '@/components/filters-bar';
import { RequestsTable } from '@/components/requests-table';
import { Button } from '@/components/ui/button';

export default function WHTRequestsPage() {
  const { requests, filters } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'to-review' | 'approved-not-injected' | 'rejected'>('all');

  const toReview = useMemo(
    () => requests.filter(r => r.status === 'Submitted' || r.status === 'Pending Review'),
    [requests]
  );

  const approvedNotInjected = useMemo(
    () => requests.filter(r => r.status === 'Approved' && r.injectionStatus !== 'Done'),
    [requests]
  );

  const rejected = useMemo(
    () => requests.filter(r => r.status === 'Rejected'),
    [requests]
  );

  const getDisplayRequests = () => {
    switch (activeTab) {
      case 'to-review':
        return filterRequests(toReview, { ...filters, status: 'All' });
      case 'approved-not-injected':
        return filterRequests(approvedNotInjected, filters);
      case 'rejected':
        return filterRequests(rejected, filters);
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
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All <span className="ml-1 text-muted-foreground">{requests.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('to-review')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'to-review'
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            To Review <span className="ml-1 text-muted-foreground">{toReview.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('approved-not-injected')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'approved-not-injected'
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Approved (Not Injected) <span className="ml-1 text-muted-foreground">{approvedNotInjected.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'rejected'
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Rejected <span className="ml-1 text-muted-foreground">{rejected.length}</span>
          </button>
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
