'use client';

import { create } from 'zustand';
import type { WHTRequest, FilterState, AuditLogEntry } from './types';
import { mockRequests } from './mock-data';

interface Store {
  requests: WHTRequest[];
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  updateRequest: (id: string, updates: Partial<WHTRequest>) => void;
  addAuditLog: (id: string, entry: AuditLogEntry) => void;
}

const defaultFilters: FilterState = {
  status: "All",
  transactionType: "All",
  sellerType: "All",
  injectionStatus: "All",
  approver: "All",
  dateRange: {},
  search: "",
  searchField: "all",
  missingDocs: "All",
  amountRange: "All",
  sla: "All"
};

export const useStore = create<Store>((set) => ({
  requests: mockRequests,
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters }
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      )
    })),
  addAuditLog: (id, entry) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? { ...req, auditLog: [...req.auditLog, entry] }
          : req
      )
    }))
}));
