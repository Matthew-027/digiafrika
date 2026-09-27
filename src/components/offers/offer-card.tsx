import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format";
import { commissionPayout } from "@/lib/marketplace";
import { PRODUCT_TYPE_LABEL } from "@/lib/product";
import type { MarketplaceOffer } from "@/lib/types";

const tones: Record<string, string> = {
  Finance: "from-forest to-forest-deep",
  Education: "from-gold-deep to-ink",
  Software: "from-ink-soft to-forest-deep",
  Health: "from-leaf to-forest-deep",
  Commerce: "from-gold to-forest",
  Creative: "from-forest-deep to-ink",
  AI: "from-ink to-leaf",
  Career: "from-leaf to-ink",
  Business: "from-forest to-ink",
  Lifestyle: "from-gold to-ink",
  Services: "from-leaf to-forest",
};

export function OfferCard({ offer }: { offer: MarketplaceOffer }) {
  const payout = commissionPayout(offer);
  return (
    <Link
      to="/offers/$slug"
      params={{ slug: offer.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-cream shadow-[var(--shadow-soft)]"
    >
      <div className={`relative h-28 overflow-hidden bg-linear-to-br ${tones[offer.category] ?? "from-forest to-ink"}`}>
        {offer.imageUrl ? (
          <img src={offer.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(135deg,transparent_0_10px,rgb(255_255_255/0.12)_10px_12px)]" />
        )}
        <Badge tone="gold" className="absolute left-3 top-3">
          {offer.category}
        </Badge>
        <Badge tone="ok" className="absolute left-3 top-12">
          Live
        </Badge>
        <span className="absolute bottom-3 right-3 font-mono text-xs text-cream/90">
          {offer.commissionType === "fixed"
            ? formatMoney(offer.commissionValue, offer.currency)
            : `${offer.commissionValue}%`}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-forest">{offer.title}</h3>
          <p className="mt-1 text-sm text-muted">{offer.tagline}</p>
        </div>
        <p className="text-xs text-muted">
          {PRODUCT_TYPE_LABEL[offer.productType]} · {offer.storeName}
        </p>
        <div className="mt-auto flex items-end justify-between border-t border-border pt-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">You earn</p>
            <p className="tabular font-semibold">{formatMoney(payout, offer.currency)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted">Price</p>
            <p className="tabular text-sm">{formatMoney(offer.priceAmount, offer.currency)}</p>
          </div>
          <ArrowUpRight className="size-4 text-forest" />
        </div>
      </div>
    </Link>
  );
}
