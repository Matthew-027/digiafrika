import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { useDash } from "@/lib/dash-context";
import { formatNgn, formatNumber, trackingUrl } from "@/lib/format";

export const Route = createFileRoute("/dashboard/links")({ component: LinksRoute });

function LinksRoute() {
  return (
    <DeskGate desk="affiliate">
      <LinksPage />
    </DeskGate>
  );
}

function LinksPage() {
  return (
    <div>
      <PageHeader
        kicker="Coming later"
        title="My links"
        description="Unique tracking links open after affiliate applications. This step is marketplace discovery only."
      />
      <EmptyState
        title="Tracking links are not live yet"
        body="Browse approved offers now. Applications, hops, and conversion pixels ship in a later step."
        action={
          <Button asChild variant="gold">
            <Link to="/dashboard/offers">Open marketplace</Link>
          </Button>
        }
      />
    </div>
  );
}
