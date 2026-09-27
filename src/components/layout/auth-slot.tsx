import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AuthSlot({ dark }: { dark?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-11 w-24 animate-pulse rounded-[10px] bg-secondary" />;
  }
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className={
            dark
              ? "text-sm font-medium text-cream/80 hover:text-gold"
              : "text-sm font-medium text-forest hover:text-ink"
          }
        >
          Desk
        </Link>
        <UserButton />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        search={{ join: undefined, ref: undefined }}
        className={
          dark
            ? "inline-flex h-11 items-center rounded-[10px] px-3 text-sm font-medium text-cream"
            : "inline-flex h-11 items-center rounded-[10px] px-3 text-sm font-medium"
        }
      >
        Sign in
      </Link>
      <Link
        to="/login"
        search={{ join: "1", ref: undefined }}
        className="inline-flex h-11 items-center rounded-[10px] bg-gold px-4 text-sm font-semibold text-ink"
      >
        Join free
      </Link>
    </div>
  );
}
