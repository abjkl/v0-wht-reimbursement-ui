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
      {/* Core Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Search</Label>
          <div className="flex">
            <Select
              value={filters.searchField}
              onValueChange={(value: any) => setFilters({ searchField: value })}
            >
              <SelectTrigger className="w-[150px] rounded-r-none border-r-0 shrink-0">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="requestId">Request ID</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="companyName">Company Name</SelectItem>
                <SelectItem value="invoiceNumber">Invoice Number</SelectItem>
                <SelectItem value="npwp">NPWP</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Input"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="rounded-l-none"
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
          <Label className="text-xs text-muted-foreground">Submission Date Range</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={filters.dateRange.start || ''}
              onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, start: e.target.value } })}
              placeholder="Start"
            />
            <Input
              type="date"
              value={filters.dateRange.end || ''}
              onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, end: e.target.value } })}
              placeholder="End"
            />
          </div>
        </div>
      </div>

      {/* Operational Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">AI Suggestion</Label>
          <Select
            value={filters.aiSuggestion || 'All'}
            onValueChange={(value: any) => setFilters({ aiSuggestion: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Approve">Approve</SelectItem>
              <SelectItem value="Reject">Reject</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Amount Range</Label>
          <Select
            value={filters.amountRange}
            onValueChange={(value: any) => setFilters({ amountRange: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Amounts</SelectItem>
              <SelectItem value="<= 1000000">{'<='} Rp 1,000,000</SelectItem>
              <SelectItem value="1000001-10000000">Rp 1M - 10M</SelectItem>
              <SelectItem value="> 10000000">{'>'} Rp 10,000,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
        <Button>Apply Filters</Button>
      </div>
    </div>
  );
}
