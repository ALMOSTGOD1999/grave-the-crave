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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={sendToAll ? "default" : "outline"}
                    onClick={() => setSendToAll(true)}
                    className={sendToAll ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    All customers
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={!sendToAll ? "default" : "outline"}
                    onClick={() => setSendToAll(false)}
                    className={!sendToAll ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
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
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full"
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
            <div className="overflow-x-auto">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
