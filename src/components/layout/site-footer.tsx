import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="text-cream" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
            The affiliate desk for African digital products. Vendors list campaigns.
            Affiliates track, earn, and get paid on local rails.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">Product</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/marketplace" className="hover:text-gold">Marketplace</Link>
            <Link to="/how-it-works" className="hover:text-gold">How it works</Link>
            <Link to="/vendors" className="hover:text-gold">Vendors</Link>
            <Link to="/login" search={{ join: undefined, ref: undefined }} className="hover:text-gold">
              Sign in
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">Rails</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Paystack, Flutterwave, and M-Pesa placeholders are wired for sandbox
            settlement. Swap in live keys before production payouts.
          </p>
        </div>
      </div>
      <div className="kente-band h-1.5" />
      <div className="mx-auto flex max-w-6xl justify-between px-4 py-4 text-xs text-cream/50">
        <span>© {new Date().getFullYear()} DigiAfrika</span>
        <span>Lagos · Nairobi · Accra</span>
      </div>
    </footer>
  );
}
