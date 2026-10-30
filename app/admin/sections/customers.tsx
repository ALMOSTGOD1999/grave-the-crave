"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, ApiError, type Customer } from "@/lib/api";
import { Search, Users } from "lucide-react";

/** Compact date+time for mobile cards (desktop tables keep toLocaleString). */
function formatWhen(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function CustomersSection() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const res = await api.customers(p, q);
      setCustomers(res.customers.data);
      setMeta(res.customers.meta);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page, appliedQuery);
  }, [load, page, appliedQuery]);

  // Debounced search — typing re-queries the backend without hammering it,
  // and always restarts from page 1.
  function onSearch(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedQuery(value.trim());
      setPage(1);
    }, 300);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Customers
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by name, phone or email"
              className="pl-9"
              aria-label="Search customers"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 py-8 text-center">Loading customers...</p>
        ) : customers.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">
              {appliedQuery
                ? "No customers match your search."
                : "No customers yet — customers are added automatically when a bill is created."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Bills</TableHead>
                    <TableHead className="text-right">Total spent</TableHead>
                    <TableHead>Last bill</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.phone ?? "—"}</TableCell>
                      <TableCell>{c.email ?? "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={c.address ?? ""}>
                        {c.address ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">{c.totalBills}</TableCell>
                      <TableCell className="text-right">
                        ₹{Number(c.totalSpent ?? 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {c.lastBillAt ? new Date(c.lastBillAt).toLocaleString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile stacked cards */}
            <div className="sm:hidden space-y-3">
              {customers.map((c) => (
                <div key={c.id} className="border rounded-lg p-3 space-y-1">
                  <p className="font-semibold">{c.name}</p>
                  {(c.phone || c.email) && (
                    <p className="text-xs text-gray-600">
                      {[c.phone, c.email].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {c.address && (
                    <p className="text-xs text-gray-500 truncate">{c.address}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                    <span className="font-medium text-primary">
                      ₹{Number(c.totalSpent ?? 0).toFixed(2)}
                    </span>
                    <span>
                      {c.totalBills} bill(s)
                      {c.lastBillAt ? ` · ${formatWhen(c.lastBillAt)}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination — same shape as BillsHistory in the billing section. */}
            {meta && meta.lastPage > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Page {meta.currentPage} of {meta.lastPage} ({meta.total} customers)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 h-10 rounded-md border text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                    disabled={page >= meta.lastPage}
                    className="px-3 h-10 rounded-md border text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
