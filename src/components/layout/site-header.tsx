import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { AuthSlot } from "@/components/layout/auth-slot";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/marketplace" as const, label: "Marketplace" },
  { to: "/how-it-works" as const, label: "How it works" },
  { to: "/vendors" as const, label: "For vendors" },
];

export function SiteHeader({ inverted }: { inverted?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={
        inverted
          ? "border-b border-cream/10 bg-forest-deep text-cream"
          : "border-b border-border bg-paper/90 backdrop-blur"
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex min-w-0 items-center">
          <Logo className={inverted ? "text-cream" : ""} />
        </Link>
        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={
                inverted
                  ? "text-sm font-medium text-cream/80 hover:text-gold"
                  : "text-sm font-medium text-muted hover:text-ink"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <AuthSlot dark={inverted} />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-[10px] md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>DigiAfrika</SheetTitle>
            <div className="mt-6 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-[10px] px-2 text-sm font-medium"
                >
                  {l.label}
                </Link>
              ))}
              <AuthSlot />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
