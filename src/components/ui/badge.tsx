import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "gold" | "ok" | "warn" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tone === "default" && "bg-forest/10 text-forest",
        tone === "gold" && "bg-gold/20 text-ink",
        tone === "ok" && "bg-leaf/15 text-forest",
        tone === "warn" && "bg-gold/30 text-ink",
        tone === "muted" && "bg-secondary text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
