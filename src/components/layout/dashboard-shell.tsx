import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  Link2,
  Megaphone,
  Settings,
  Shield,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@/lib/auth/gates";
import { useDash } from "@/lib/dash-context";
import { formatNgn } from "@/lib/format";
import { DESK_HOME, DESK_LABEL, type DeskRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

type NavItem = {
  to:
    | "/dashboard/admin"
    | "/dashboard/vendor"
    | "/dashboard/affiliate"
    | "/dashboard/offers"
    | "/dashboard/links"
    | "/dashboard/commissions"
    | "/dashboard/payouts"
    | "/dashboard/campaigns"
    | "/dashboard/referrals"
    | "/dashboard/notifications"
    | "/dashboard/settings";
  label: string;
  icon: typeof LayoutDashboard;
};

const navByDesk: Record<DeskRole, NavItem[]> = {
  admin: [
    { to: "/dashboard/admin", label: "Admin Dashboard", icon: Shield },
    { to: "/dashboard/notifications", label: "Inbox", icon: Bell },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  vendor: [
    { to: "/dashboard/vendor", label: "Vendor Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/campaigns", label: "Products", icon: Megaphone },
    { to: "/dashboard/notifications", label: "Inbox", icon: Bell },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  affiliate: [
    { to: "/dashboard/affiliate", label: "Affiliate Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/offers", label: "Marketplace", icon: Store },
    { to: "/dashboard/links", label: "Links", icon: Link2 },
    { to: "/dashboard/commissions", label: "Commissions", icon: Wallet },
    { to: "/dashboard/payouts", label: "Payouts", icon: CreditCard },
    { to: "/dashboard/referrals", label: "Referrals", icon: Users },
    { to: "/dashboard/notifications", label: "Inbox", icon: Bell },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
};

function Nav({ onGo }: { onGo?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data } = useDash();
  const visible = navByDesk[data.profile.deskRole];
  return (
    <nav className="flex flex-col gap-1">
      {visible.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onGo}
            className={cn(
              "flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-medium",
              active ? "bg-gold text-ink" : "text-cream/80 hover:bg-secondary hover:text-cream",
            )}
          >
            <Icon className="size-4" />
            {item.label}
            {item.to === "/dashboard/notifications" && data.unread > 0 ? (
              <span className="ml-auto tabular text-xs">{data.unread}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { data } = useDash();
  const [open, setOpen] = useState(false);
  const desk = data.profile.deskRole;
  return (
    <div className="dash-shell min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-[1400px]">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border p-4 lg:flex">
          <Link to="/" className="mb-6">
            <Logo className="text-cream" />
          </Link>
          <Nav />
          <div className="mt-auto rounded-[12px] border border-border bg-secondary p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Available</p>
            <p className="tabular font-display text-xl">{formatNgn(Number(data.wallet.availableNgn))}</p>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between gap-3 border-b border-border px-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="grid h-11 w-11 place-items-center rounded-[10px] lg:hidden">
                <Logo markOnly />
              </SheetTrigger>
              <SheetContent className="dash-shell bg-paper text-cream">
                <SheetTitle className="text-cream">Desk</SheetTitle>
                <div className="mt-4">
                  <Nav onGo={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <p className="tabular text-sm lg:hidden">{formatNgn(Number(data.wallet.availableNgn))}</p>
            <div className="hidden text-sm text-muted-foreground lg:block">
              {data.profile.displayName} · {DESK_LABEL[desk]}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild size="sm" variant="gold">
                <Link to={DESK_HOME[desk]}>{DESK_LABEL[desk]}</Link>
              </Button>
              <UserButton />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
