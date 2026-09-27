import { Link } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { useDash } from "@/lib/dash-context";
import { DESK_HOME, DESK_LABEL, type DeskRole } from "@/lib/roles";
import { assertDeskAccess } from "@/lib/server/platform";
import type { Profile } from "@/lib/types";

export function AccessDenied({ profile, expected }: { profile: Profile; expected?: DeskRole }) {
  const [signingOut, setSigningOut] = useState(false);
  const who = profile.email || profile.displayName;
  const home = DESK_HOME[profile.deskRole];

  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-gold">
        <ShieldOff className="size-7" />
      </div>
      <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Access denied</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        You are signed in as <span className="font-medium text-foreground">{who}</span> on the{" "}
        <span className="font-medium text-foreground">{DESK_LABEL[profile.deskRole]}</span>.
        {expected ? ` The ${DESK_LABEL[expected]} is limited to ${expected} accounts.` : null}
      </p>
      <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link to={home}>{DESK_LABEL[profile.deskRole]}</Link>
        </Button>
        <Button
          variant="outline"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut().catch(() => setSigningOut(false));
          }}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </div>
  );
}

export function DeskGate({ desk, children }: { desk: DeskRole; children: ReactNode }) {
  const { data } = useDash();
  const clientOk = data.profile.deskRole === desk;
  const [allowed, setAllowed] = useState<boolean | null>(clientOk ? null : false);

  useEffect(() => {
    if (data.profile.deskRole !== desk) {
      setAllowed(false);
      return;
    }
    let cancelled = false;
    assertDeskAccess({ data: { desk } })
      .then(() => {
        if (!cancelled) setAllowed(true);
      })
      .catch(() => {
        if (!cancelled) setAllowed(false);
      });
    return () => {
      cancelled = true;
    };
  }, [desk, data.profile.deskRole, data.profile.userId]);

  if (allowed === false) return <AccessDenied profile={data.profile} expected={desk} />;
  if (allowed !== true) {
    return <div className="h-40 animate-pulse rounded-xl bg-secondary" />;
  }
  return <>{children}</>;
}
