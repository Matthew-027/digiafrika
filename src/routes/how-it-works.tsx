import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Link2, Radio, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({ component: HowItWorks });

const steps = [
  {
    icon: Radio,
    title: "Pick a live offer",
    body: "Filter the marketplace by niche, cookie window, and commission. Every listing shows price, payout, and creatives from the vendor.",
  },
  {
    icon: Link2,
    title: "Share a unique link",
    body: "DigiAfrika issues a tracking code per affiliate per campaign. Clicks are logged, cookies last 21–60 days, and the hop tags the vendor URL.",
  },
  {
    icon: Banknote,
    title: "Commissions hit the wallet",
    body: "Sandbox sales and production pixels credit the same ledger. Referral overrides pay the person who invited you.",
  },
  {
    icon: ShieldCheck,
    title: "Request settlement",
    body: "Paystack, Flutterwave, M-Pesa, or Nigerian bank transfer. Operators approve the queue. Live keys slot into the same payload.",
  },
];

function HowItWorks() {
  return (
    <MarketingShell>
      <section className="bg-forest-deep text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">How it works</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
            A desk for promoting African digital products — not another link shortener.
          </h1>
          <p className="mt-4 max-w-2xl text-cream/75">
            Affiliates promote. Vendors list. Operators settle. Tracking, commissions, and payouts
            live in one ledger with local-rail placeholders ready for production keys.
          </p>
        </div>
        <div className="kente-band h-2" />
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-2">
        {steps.map((step) => (
          <article key={step.title} className="rounded-xl border border-border bg-cream p-6">
            <div className="grid h-11 w-11 place-items-center rounded-[10px] bg-forest text-cream">
              <step.icon className="size-5" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </article>
        ))}
      </section>
      <section className="bg-paper-2">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-forest">Tracking</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Pixel-ready conversions</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Production checkouts POST to the convert endpoint with the affiliate code, order
              reference, amount, and the workspace pixel secret. The sandbox hop at{" "}
              <code className="font-mono text-ink">/t/{"{code}"}</code> records the click first.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-ink p-5 font-mono text-xs leading-relaxed text-cream">
            {`POST /api/convert
{
  "code": "da••••",
  "orderRef": "ORD-1042",
  "amountNgn": 45000,
  "secret": "digiafrika_sandbox_pixel"
}`}
          </pre>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-xl bg-forest-deep px-6 py-10 text-cream md:px-10">
          <h2 className="font-display text-3xl font-semibold">Open a desk in a minute.</h2>
          <p className="mt-2 max-w-xl text-sm text-cream/70">
            First account on a new workspace is the operator. Promote a live offer or list your own.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="gold">
              <Link to="/login" search={{ join: "1", ref: undefined }}>
                Join free
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-cream/30 text-cream hover:bg-cream/10">
              <Link to="/marketplace">Browse offers</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
