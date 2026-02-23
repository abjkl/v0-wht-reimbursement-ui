'use client';

import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function FiltersBar() {
  const { filters, setFilters, resetFilters } = useStore();

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* First Row - Search and Primary Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Search</Label>
          <div className="flex gap-2">
            <Select defaultValue="request-id">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="request-id">Request ID</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Input"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={filters.status} onValueChange={(value: any) => setFilters({ status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Transaction Type</Label>
          <Select
            value={filters.transactionType}
            onValueChange={(value: any) => setFilters({ transactionType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="MP Platform">MP Platform</SelectItem>
              <SelectItem value="Food Platform Invoice">Food Platform Invoice</SelectItem>
              <SelectItem value="SVS Prepaid Invoice">SVS Prepaid Invoice</SelectItem>
              <SelectItem value="AMS PPS">AMS PPS</SelectItem>
              <SelectItem value="AMS PPP">AMS PPP</SelectItem>
              <SelectItem value="FBS">FBS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View All Link */}
      <div className="flex items-center justify-between border-t pt-4">
        <button className="text-sm text-primary hover:underline">View All</button>
        <div className="flex gap-2">
          <Button onClick={() => {/* Apply search */}}>Search</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
