"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, ApiError, type Promotion } from "@/lib/api";
import { Send, Users, User } from "lucide-react";

/** Compact date+time for mobile cards (desktop table keeps toLocaleString). */
function formatWhen(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function PromotionSection() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [recipientsInput, setRecipientsInput] = useState("");
  const [sending, setSending] = useState(false);

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { promotions } = await api.promotions();
      setPromotions(promotions);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to load promotions"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !html.trim()) {
      toast.error("Subject and HTML body are required");
      return;
    }
    const recipients: "all" | string[] = sendToAll
      ? "all"
      : recipientsInput
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);
    if (!sendToAll && recipients.length === 0) {
      toast.error("Add at least one recipient email");
      return;
    }
    setSending(true);
    try {
      const { promotion } = await api.createPromotion({
        subject: subject.trim(),
        html: html.trim(),
        recipients,
      });
      toast.success(
        `Promotion sent to ${promotion.sentCount} recipient${
          promotion.sentCount === 1 ? "" : "s"
        }`
      );
      setSubject("");
      setHtml("");
      setRecipientsInput("");
      load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to send promotion"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Compose promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={send} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Weekend special: 20% off brownies!"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">HTML body</label>
              <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={6}
                placeholder="<p>Fresh bakes, weekend treats — 20% off this Saturday.</p>"
                className="font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={sendToAll ? "default" : "outline"}
                    onClick={() => setSendToAll(true)}
                    className={`h-10 sm:h-8 ${sendToAll ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    All customers
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={!sendToAll ? "default" : "outline"}
                    onClick={() => setSendToAll(false)}
                    className={`h-10 sm:h-8 ${!sendToAll ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Specific emails
                  </Button>
                </div>
              </div>
              {!sendToAll && (
                <div className="flex-1 space-y-1">
                  <Input
                    value={recipientsInput}
                    onChange={(e) => setRecipientsInput(e.target.value)}
                    placeholder="a@example.com, b@example.com"
                  />
                </div>
              )}
              <Button
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto h-11 sm:h-9 justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-full"
              >
                <Send className="h-4 w-4 mr-1" />
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promotion history</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 py-6 text-center">Loading history...</p>
          ) : promotions.length === 0 ? (
            <p className="text-gray-500 py-6 text-center">No promotions sent yet.</p>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead className="text-right">Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotions.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell>
                          {new Date(promo.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{promo.subject}</TableCell>
                        <TableCell>
                          {promo.recipients === "all"
                            ? "All customers"
                            : Array.isArray(promo.recipients)
                              ? promo.recipients.join(", ")
                              : String(promo.recipients)}
                        </TableCell>
                        <TableCell className="text-right">
                          {promo.sentCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: stacked cards instead of a horizontally scrolling table */}
              <div className="sm:hidden space-y-3">
                {promotions.map((promo) => (
                  <div key={promo.id} className="rounded-lg border bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm leading-snug">
                        {promo.subject}
                      </p>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full shrink-0">
                        {promo.sentCount} sent
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 break-words">
                      {promo.recipients === "all"
                        ? "All customers"
                        : Array.isArray(promo.recipients)
                          ? promo.recipients.join(", ")
                          : String(promo.recipients)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {formatWhen(promo.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
