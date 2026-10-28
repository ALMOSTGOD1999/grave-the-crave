"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, ApiError, type Bill, type Product } from "@/lib/api";
import { Plus, Trash2, FileText, Mail, MailWarning, MessageCircle } from "lucide-react";

interface CartLine {
  product: Product;
  quantity: number;
}

/**
 * Authenticated PDF download. The PDF endpoint requires the Bearer token, so
 * a plain `<a href>` (browser navigation) gets 401 and downloads nothing —
 * fetch the bytes with auth, then hand the blob to the browser.
 */
async function downloadBillPdf(id: number, billNumber: string) {
  try {
    await api.downloadBillPdf(id, billNumber);
  } catch (error) {
    toast.error(
      error instanceof ApiError ? error.message : "Failed to download PDF"
    );
  }
}

/** Compact date+time for mobile cards (desktop tables keep toLocaleString). */
function formatWhen(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/**
 * India-only: normalize any phone shape (+91, 0091, 0-prefixed, spaces,
 * dashes) to wa.me digits — `91` followed by a 10-digit Indian mobile
 * (first digit 6-9). Returns null when the number can't be a mobile.
 */
function whatsappDigits(phone: string | null | undefined): string | null {
  let d = (phone ?? "").replace(/\D/g, "");
  if (d.startsWith("0091")) d = d.slice(4);
  if (d.length === 12 && d.startsWith("91")) {
    // already 91 + 10 digits
  } else if (d.length === 11 && d.startsWith("0")) {
    d = d.slice(1);
  }
  if (d.length === 10) d = `91${d}`;
  return /^91[6-9]\d{9}$/.test(d) ? d : null;
}

function billWhatsAppText(bill: Bill): string {
  const amount = bill.total.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return `Hi ${bill.customerName}, here's your bill ${bill.billNumber} for ${amount} from Grave the Crave. Thank you for your order!`;
}

/**
 * Send the bill PDF to the customer's WhatsApp — no WhatsApp API involved.
 * - Phone/browser that can share files: the OS share sheet opens with the
 *   PDF already attached (admin picks WhatsApp → PDF + message go through).
 * - Everywhere else: the PDF is downloaded and a wa.me chat opens with the
 *   message pre-filled, so the admin attaches the file with one tap.
 */
async function shareBillOnWhatsApp(bill: Bill) {
  const digits = whatsappDigits(bill.customerPhone);
  if (!digits) {
    toast.error(
      "Add the customer's 10-digit mobile number to send the bill on WhatsApp"
    );
    return;
  }

  const text = billWhatsAppText(bill);
  let blob: Blob;
  try {
    blob = await api.fetchBillPdf(bill.id);
  } catch (error) {
    toast.error(
      error instanceof ApiError ? error.message : "Failed to load the bill PDF"
    );
    return;
  }

  const file = new File([blob], `${bill.billNumber}.pdf`, {
    type: "application/pdf",
  });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        text,
        title: bill.billNumber,
      });
      return;
    } catch (error) {
      // Admin dismissed the share sheet — nothing more to do.
      if ((error as { name?: string })?.name === "AbortError") return;
      // Any other failure falls through to download + open chat.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${bill.billNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  window.open(
    `https://wa.me/${digits}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer"
  );
  toast.info(
    "PDF downloaded — attach it in the WhatsApp chat that just opened"
  );
}

export default function BillingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Customer fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Product search + lines
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [creating, setCreating] = useState(false);
  // Always starts selected; re-selected after every successful bill.
  const [deductStock, setDeductStock] = useState(true);
  const [billsRefreshKey, setBillsRefreshKey] = useState(0);
  const [lastBill, setLastBill] = useState<{
    bill: Bill;
    emailed: boolean;
    emailWarning?: string;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const { products } = await api.products();
      setProducts(products.filter((p) => p.isActive));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    api
      .suggestProducts(query.trim())
      .then(({ products }) => {
        if (!cancelled) setSuggestions(products);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const addLine = (product: Product) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setQuery("");
    setSuggestions([]);
  };

  const setQuantity = (productId: number, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.product.id !== productId)
        : prev.map((l) =>
            l.product.id === productId ? { ...l, quantity: Math.min(quantity, 999) } : l
          )
    );
  };

  const removeLine = (productId: number) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  };

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.sellingPrice * l.quantity,
    0
  );

  const createBill = async () => {
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (lines.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    setCreating(true);
    try {
      const result = await api.createBill({
        customerName: customerName.trim(),
        customerAddress: customerAddress.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        deductStock,
        items: lines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
      });
      setLastBill(result);
      toast.success(`Bill ${result.bill.billNumber} created`);
      if (result.emailWarning) {
        toast.warning(result.emailWarning);
      }
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setCustomerAddress("");
      setLines([]);
      setDeductStock(true); // always auto-selected for the next bill
      load(); // refresh stock levels after bill
      setBillsRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to create bill"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>New bill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Customer name *</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in customer"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                inputMode="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile (for WhatsApp bill)"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="To send the bill by email"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="text-sm font-medium">Add product</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name (e.g. cake, bread)"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-y-auto">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full text-left px-3 py-3 sm:py-2 hover:bg-amber-50 flex justify-between items-center gap-2"
                    onClick={() => addLine(p)}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-sm text-gray-500 shrink-0">
                      ₹{p.sellingPrice.toFixed(2)} · {p.stockQty} in stock
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {lines.length > 0 && (
            <>
              <div className="hidden sm:block border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-36">Qty</TableHead>
                      <TableHead className="w-32 text-right">Price</TableHead>
                      <TableHead className="w-32 text-right">Total</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line.product.id}>
                        <TableCell className="font-medium">
                          {line.product.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                setQuantity(line.product.id, line.quantity - 1)
                              }
                            >
                              −
                            </Button>
                            <Input
                              type="number"
                              min={1}
                              value={line.quantity}
                              onChange={(e) =>
                                setQuantity(line.product.id, Number(e.target.value))
                              }
                              className="h-8 w-16 text-center"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                setQuantity(line.product.id, line.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{line.product.sellingPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{(line.product.sellingPrice * line.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 h-7 w-7 p-0"
                            onClick={() => removeLine(line.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: stacked line cards with thumb-sized steppers */}
              <div className="sm:hidden space-y-3">
                {lines.map((line) => (
                  <div
                    key={line.product.id}
                    className="rounded-lg border bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm leading-snug">
                          {line.product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ₹{line.product.sellingPrice.toFixed(2)} each
                        </p>
                      </div>
                      <p className="font-semibold text-amber-600 text-sm shrink-0">
                        ₹
                        {(
                          line.product.sellingPrice * line.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 p-0 text-lg"
                          aria-label={`Decrease quantity of ${line.product.name}`}
                          onClick={() =>
                            setQuantity(line.product.id, line.quantity - 1)
                          }
                        >
                          −
                        </Button>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={line.quantity}
                          aria-label={`Quantity of ${line.product.name}`}
                          onChange={(e) =>
                            setQuantity(line.product.id, Number(e.target.value))
                          }
                          className="h-10 w-16 text-center"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 p-0 text-lg"
                          aria-label={`Increase quantity of ${line.product.name}`}
                          onClick={() =>
                            setQuantity(line.product.id, line.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-10 w-10 p-0 text-red-600"
                        aria-label={`Remove ${line.product.name}`}
                        onClick={() => removeLine(line.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t">
            <div className="space-y-2">
              <div className="text-base sm:text-lg font-semibold">
                Subtotal:{" "}
                <span className="text-amber-600">₹{subtotal.toFixed(2)}</span>
              </div>
              <label
                htmlFor="deduct-stock"
                className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer select-none w-fit py-1 -my-1"
              >
                <Checkbox
                  id="deduct-stock"
                  checked={deductStock}
                  onCheckedChange={(checked) => setDeductStock(checked === true)}
                  className="h-5 w-5"
                />
                Deduct from stock
              </label>
            </div>
            <Button
              onClick={createBill}
              disabled={creating || lines.length === 0}
              className="w-full sm:w-auto h-12 justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              {creating ? "Creating..." : "Create bill"}
            </Button>
          </div>

          {lastBill && (
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-primary">
                  Bill {lastBill.bill.billNumber} created — ₹
                  {lastBill.bill.total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 flex flex-wrap items-center gap-1 break-all">
                  {lastBill.emailed ? (
                    <>
                      <Mail className="h-3 w-3 shrink-0" /> Emailed to{" "}
                      {lastBill.bill.customerEmail}
                    </>
                  ) : lastBill.emailWarning ? (
                    <>
                      <MailWarning className="h-3 w-3 shrink-0" />{" "}
                      {lastBill.emailWarning}
                    </>
                  ) : (
                    <>Not emailed (no customer email provided)</>
                  )}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="rounded-full w-full sm:w-auto border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => shareBillOnWhatsApp(lastBill.bill)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full w-full sm:w-auto"
                  onClick={() =>
                    downloadBillPdf(lastBill.bill.id, lastBill.bill.billNumber)
                  }
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <BillsHistory refreshKey={billsRefreshKey} />
    </div>
  );
}

function BillsHistory({ refreshKey }: { refreshKey?: number }) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    currentPage: number;
    lastPage: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { bills } = await api.bills(page);
      setBills(bills.data);
      setMeta(bills.meta);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to load bills"
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-gray-500 py-6 text-center">Loading bills...</p>
        ) : bills.length === 0 ? (
          <p className="text-gray-500 py-6 text-center">No bills yet.</p>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-mono text-sm">
                        {bill.billNumber}
                      </TableCell>
                      <TableCell>
                        {new Date(bill.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.customerName}</TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{bill.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {bill.emailed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                            <Mail className="h-3 w-3" /> Sent
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-emerald-600 hover:text-emerald-700"
                            aria-label={`Send bill ${bill.billNumber} on WhatsApp`}
                            onClick={() => shareBillOnWhatsApp(bill)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-600"
                            aria-label={`Download PDF for bill ${bill.billNumber}`}
                            onClick={() =>
                              downloadBillPdf(bill.id, bill.billNumber)
                            }
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: stacked bill cards */}
            <div className="sm:hidden space-y-3">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="rounded-lg border bg-white p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-medium">
                        {bill.billNumber}
                      </span>
                      {bill.emailed && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <Mail className="h-3 w-3" /> Sent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {bill.customerName}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatWhen(bill.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-sm">
                      ₹{bill.total.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => shareBillOnWhatsApp(bill)}
                      aria-label={`Send bill ${bill.billNumber} on WhatsApp`}
                      className="h-10 w-10 flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadBillPdf(bill.id, bill.billNumber)}
                      aria-label={`Download PDF for bill ${bill.billNumber}`}
                      className="h-10 w-10 flex items-center justify-center rounded-md text-amber-600 hover:bg-amber-50"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {meta && meta.lastPage > 1 && (
              <div className="flex items-center justify-between text-sm">
                <span>
                  Page {meta.currentPage} of {meta.lastPage} ({meta.total} bills)
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-10"
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= meta.lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-10"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
