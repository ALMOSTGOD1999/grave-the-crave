"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { Bold, Heading2, Link2, List, Send, User, Users } from "lucide-react";

/** Compact date+time for mobile cards (desktop table keeps toLocaleString). */
function formatWhen(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/**
 * The preview renders admin HTML, so drop anything that could run code or
 * restyle/navigate the admin panel itself (`dangerouslySetInnerHTML` does
 * execute `<style>`/`<link>`/`<meta>` even though scripts are inert).
 */
function sanitizeForPreview(raw: string): string {
  return raw
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe\s*>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

/** One-click tags so the admin doesn't have to hand-write HTML. */
const QUICK_ACTIONS = [
  {
    key: "strong",
    label: "Bold",
    icon: Bold,
    open: "<strong>",
    close: "</strong>",
  },
  { key: "h2", label: "Heading", icon: Heading2, open: "<h2>", close: "</h2>" },
  {
    key: "a",
    label: "Link",
    icon: Link2,
    open: '<a href="https://gravethecrave.com/menu">',
    close: "</a>",
  },
  {
    key: "ul",
    label: "List",
    icon: List,
    open: "<ul><li>",
    close: "</li></ul>",
  },
] as const;

type QuickKey = (typeof QUICK_ACTIONS)[number]["key"];

export default function PromotionSection() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [recipientsInput, setRecipientsInput] = useState("");
  const [sending, setSending] = useState(false);

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Wrap the current selection in a tag, caret restored inside it. */
  const applyTag = (key: QuickKey) => {
    const el = textareaRef.current;
    const action = QUICK_ACTIONS.find((a) => a.key === key);
    if (!el || !action) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = html.slice(start, end);
    setHtml(
      html.slice(0, start) + action.open + selected + action.close + html.slice(end)
    );

    // React has flushed the new value by the next frame.
    requestAnimationFrame(() => {
      el.focus();
      const inner = start + action.open.length;
      el.setSelectionRange(inner, inner + selected.length);
    });
  };

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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="promo-html" className="text-sm font-medium">
                  HTML body
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.key}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => applyTag(action.key)}
                        className="h-10 sm:h-8"
                      >
                        <Icon className="h-3.5 w-3.5 mr-1" />
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
                <Textarea
                  id="promo-html"
                  ref={textareaRef}
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  rows={6}
                  placeholder="<p>Fresh bakes, weekend treats — 20% off this Saturday.</p>"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Preview</span>
                <div className="min-h-[9rem] max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white p-3">
                  {html.trim() ? (
                    <div
                      className="text-sm leading-relaxed text-gray-800 break-words [&_a]:text-amber-600 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-amber-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-500 [&_em]:italic [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:font-semibold [&_img]:max-w-full [&_img]:rounded [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
                      dangerouslySetInnerHTML={{ __html: sanitizeForPreview(html) }}
                    />
                  ) : (
                    <p className="text-sm text-gray-400">
                      Preview will appear here
                    </p>
                  )}
                </div>
              </div>
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
