import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function MarketingShell({
  children,
  invertedHeader,
}: {
  children: ReactNode;
  invertedHeader?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader inverted={invertedHeader} />
      {children}
      <SiteFooter />
    </div>
  );
}
