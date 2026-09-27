import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { PageHeader } from "@/components/dashboard/page-header";
import { MarketplaceBrowser, type MarketplaceSearch } from "@/components/offers/marketplace-browser";

export const Route = createFileRoute("/dashboard/offers")({ component: OffersRoute });

function OffersRoute() {
  return (
    <DeskGate desk="affiliate">
      <DeskOffers />
    </DeskGate>
  );
}

function DeskOffers() {
  const [search, setSearch] = useState<MarketplaceSearch>({});
  return (
    <div>
      <PageHeader
        kicker="Marketplace"
        title="Offers to promote"
        description="Only approved products from approved vendors. Tracking links and applications come in a later step."
      />
      <MarketplaceBrowser value={search} onChange={setSearch} tone="dash" />
    </div>
  );
}
