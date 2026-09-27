import { createFileRoute, Link } from "@tanstack/react-router";
import { Megaphone, Percent, Radar, Wallet } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/vendors")({ component: Vendors });

const points = [
  {
    icon: Megaphone,
    title: "List in minutes",
    body: "Title, price, commission, cookie window, landing URL, and creatives. Campaigns go live on the marketplace immediately.",
  },
  {
    icon: Percent,
    title: "You set the split",
    body: "Commission from 0–90%. Affiliates see exactly what they earn in Naira before they promote.",
  },
  {
    icon: Radar,
    title: "See who is selling",
    body: "Clicks and sales roll up on the vendor desk. Pause a campaign without deleting tracking history.",
  },
  {
    icon: Wallet,
    title: "Keep the remainder",
    body: "After affiliate commission and the platform fee, vendor share credits the same wallet used for payouts.",
  },
];

function Vendors() {
  return (
    <MarketingShell>
      <section className="bg-ink text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">For vendors</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Put your digital product in front of African affiliates who already know WhatsApp.
            </h1>
            <p className="mt-4 max-w-xl text-cream/75">
              Courses, software, and kits priced in Naira. DigiAfrika handles tracking links,
              commission math, and the settlement queue so you can stay on the product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/login" search={{ join: "1", ref: undefined }}>
                  List a campaign
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-cream/30 text-cream hover:bg-cream/10">
                <Link to="/how-it-works">See the pixel</Link>
              </Button>
            </div>
          </div>
          <aside className="md:col-span-5">
            <div className="rounded-xl border border-cream/15 bg-forest-deep p-5">
              <p className="text-xs uppercase tracking-wider text-gold">Typical split</p>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Customer pays" value="₦45,000" />
                <Row label="Affiliate (55%)" value="₦24,750" />
                <Row label="Platform fee (5%)" value="₦2,250" />
                <Row label="Vendor remainder" value="₦18,000" />
              </dl>
              <p className="mt-4 text-xs text-cream/60">
                Figures follow the Naira Masterclass demo offer. Your campaign sets its own commission.
              </p>
            </div>
          </aside>
        </div>
        <div className="kente-band h-2" />
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2">
        {points.map((point) => (
          <article key={point.title} className="rounded-xl border border-border bg-cream p-6">
            <point.icon className="size-5 text-forest" />
            <h2 className="mt-4 font-display text-xl font-semibold">{point.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
          </article>
        ))}
      </section>
    </MarketingShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-cream/10 pb-2">
      <dt className="text-cream/70">{label}</dt>
      <dd className="tabular font-medium">{value}</dd>
    </div>
  );
}
