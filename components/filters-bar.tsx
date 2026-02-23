'use client';

import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export function FiltersBar() {
  const { filters, setFilters, resetFilters } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, email, company, invoice, shop ID, merchant ID..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={resetFilters}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <Select
          value={filters.status}
          onValueChange={(value: any) => setFilters({ status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Pending Review">Pending Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.transactionType}
          onValueChange={(value: any) => setFilters({ transactionType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Transaction Type" />
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

        <Select
          value={filters.sellerType}
          onValueChange={(value: any) => setFilters({ sellerType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Party Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Party Types</SelectItem>
            <SelectItem value="Mall">Mall</SelectItem>
            <SelectItem value="Non-mall">Non-mall</SelectItem>
            <SelectItem value="Merchant">Merchant</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.injectionStatus}
          onValueChange={(value: any) => setFilters({ injectionStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Injection Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Injection</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.missingDocs}
          onValueChange={(value: any) => setFilters({ missingDocs: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Documents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Documents</SelectItem>
            <SelectItem value="Complete">Complete (3/3)</SelectItem>
            <SelectItem value="Missing WHT Slip">Missing WHT Slip</SelectItem>
            <SelectItem value="Missing Tax Invoice">Missing Tax Invoice</SelectItem>
            <SelectItem value="Missing Shopee Invoice">Missing Invoice</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.amountRange}
          onValueChange={(value: any) => setFilters({ amountRange: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Amount Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Amounts</SelectItem>
            <SelectItem value="<= 1000000">≤ Rp 1,000,000</SelectItem>
            <SelectItem value="1000001-10000000">Rp 1M - 10M</SelectItem>
            <SelectItem value="> 10000000">&gt; Rp 10,000,000</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sla}
          onValueChange={(value: any) => setFilters({ sla: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="SLA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All SLA</SelectItem>
            <SelectItem value="> 3 days">Submitted &gt; 3 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
