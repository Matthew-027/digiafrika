import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { useDash } from "@/lib/dash-context";
import { formatDateTime } from "@/lib/format";
import { markNotificationsRead } from "@/lib/server/platform";

export const Route = createFileRoute("/dashboard/notifications")({ component: InboxPage });

function InboxPage() {
  const { data, reload } = useDash();
  const [busy, setBusy] = useState(false);

  async function markAll() {
    setBusy(true);
    try {
      await markNotificationsRead();
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not mark as read");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        kicker="Inbox"
        title="Notifications"
        description="Commissions, payouts, referrals, and campaign events."
        action={
          data.unread > 0 ? (
            <Button variant="outline" disabled={busy} onClick={() => void markAll()}>
              {busy ? "Updating…" : "Mark all read"}
            </Button>
          ) : null
        }
      />
      {data.notifications.length === 0 ? (
        <EmptyState title="Inbox is empty" body="Activity from tracking, sales, and settlement lands here." />
      ) : (
        <ul className="space-y-2">
          {data.notifications.map((n) => {
            const unread = !n.readAt;
            const inner = (
              <article
                className={
                  unread
                    ? "rounded-xl border border-gold/40 bg-card p-4"
                    : "rounded-xl border border-border bg-card p-4"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                </div>
              </article>
            );
            return (
              <li key={n.id}>
                {n.href ? (
                  <a href={n.href} className="block">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
