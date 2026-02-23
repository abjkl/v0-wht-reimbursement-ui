'use client';

import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { filterRequests } from '@/lib/filter-utils';
import { FiltersBar } from '@/components/filters-bar';
import { RequestsTable } from '@/components/requests-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function WHTRequestsPage() {
  const { requests, filters, setFilters } = useStore();

  const filteredRequests = useMemo(
    () => filterRequests(requests, filters),
    [requests, filters]
  );

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

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'to-review':
        setFilters({ status: 'All' });
        // Filter in component
        break;
      case 'approved-not-injected':
        setFilters({ status: 'Approved', injectionStatus: 'Not Started' });
        break;
      case 'rejected':
        setFilters({ status: 'Rejected' });
        break;
      case 'all':
        setFilters({ status: 'All', injectionStatus: 'All' });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Indonesia WHT Reimbursement</h1>
            <p className="text-muted-foreground">Tax x Ops processing workspace</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="all" className="space-y-6" onValueChange={handleTabChange}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="to-review" className="gap-2">
                To Review
                <Badge variant="secondary" className="ml-1">
                  {toReview.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved-not-injected" className="gap-2">
                Approved (Not Injected)
                <Badge variant="secondary" className="ml-1">
                  {approvedNotInjected.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                Rejected
                <Badge variant="secondary" className="ml-1">
                  {rejected.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                All
                <Badge variant="secondary" className="ml-1">
                  {requests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="text-sm text-muted-foreground">
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
          </div>

          <FiltersBar />

          <TabsContent value="to-review" className="mt-6">
            <RequestsTable requests={filterRequests(toReview, { ...filters, status: 'All' })} />
          </TabsContent>

          <TabsContent value="approved-not-injected" className="mt-6">
            <RequestsTable requests={approvedNotInjected} />
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <RequestsTable requests={rejected} />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <RequestsTable requests={filteredRequests} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
