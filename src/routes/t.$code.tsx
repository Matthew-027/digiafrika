import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { recordClick } from "@/lib/server/platform";

export const Route = createFileRoute("/t/$code")({
  loader: async ({ params }) => recordClick({ data: { code: params.code } }),
  component: TrackHop,
});

function TrackHop() {
  const hop = Route.useLoaderData();

  if (!hop.ok) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper px-4">
        <div className="max-w-md text-center">
          <Logo />
          <h1 className="mt-6 font-display text-2xl font-semibold">Unknown tracking link</h1>
          <p className="mt-2 text-sm text-muted">This code is not attached to a live enrollment.</p>
          <Button asChild className="mt-6">
            <Link to="/marketplace">Back to marketplace</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-forest-deep text-cream">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-12">
        <Logo className="text-cream" />
        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gold">Sandbox hop</p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">{hop.title}</h1>
        <p className="mt-2 text-sm text-cream/70">
          Click recorded for {hop.vendor}. Cookie window {hop.cookieDays} days. Production pixels
          redirect immediately; this preview stays on DigiAfrika so you can inspect the ledger.
        </p>
        <p className="mt-6 break-all rounded-[12px] border border-cream/15 bg-ink/40 px-3 py-3 font-mono text-xs">
          {hop.url}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="gold" className="flex-1">
            <a href={hop.url} target="_blank" rel="noreferrer">
              Open vendor page <ExternalLink className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1 border-cream/30 text-cream hover:bg-cream/10">
            <Link to="/marketplace">Stay on DigiAfrika</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
