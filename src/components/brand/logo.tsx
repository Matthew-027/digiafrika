import { cn } from "@/lib/utils";

export function Logo({ className, markOnly }: { className?: string; markOnly?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#146C3F" />
        <path d="M7 22V10h5.2c3.1 0 5 1.6 5 4.1 0 1.6-.8 2.8-2.2 3.5L20.8 22h-4.1l-5-6.1H11V22H7Zm4-9.4v2.8h1.4c1.3 0 2-.6 2-1.4 0-.8-.7-1.4-2-1.4H11Z" fill="#FBF8F0" />
        <rect x="22" y="10" width="3.2" height="12" rx="1" fill="#E6B422" />
      </svg>
      {markOnly ? (
        <span className="sr-only">DigiAfrika</span>
      ) : (
        <span className="font-display text-lg font-semibold tracking-tight">
          DigiAfrika
        </span>
      )}
    </span>
  );
}
