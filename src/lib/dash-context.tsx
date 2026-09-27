import { useNavigate } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getDashboard } from "@/lib/server/platform";

type DashData = Awaited<ReturnType<typeof getDashboard>>;
type LoadedDash = Extract<DashData, { profile: NonNullable<DashData["profile"]> }>;

type Ctx = {
  data: LoadedDash;
  reload: () => Promise<void>;
};

const DashCtx = createContext<Ctx | null>(null);

export function useDash() {
  const ctx = useContext(DashCtx);
  if (!ctx) throw new Error("useDash must be used in the dashboard");
  return ctx;
}

export function DashboardGate({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [data, setData] = useState<LoadedDash | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const next = await getDashboard();
    if (next.profile) setData(next as LoadedDash);
  }, []);

  useEffect(() => {
    if (isPending || !user) return;
    let cancelled = false;
    getDashboard()
      .then((next) => {
        if (cancelled) return;
        if (!next.profile) {
          void navigate({ to: "/onboarding" });
          return;
        }
        setData(next as LoadedDash);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, user, navigate]);

  if (isPending) {
    return (
      <div className="dash-shell grid min-h-dvh place-items-center">
        <div className="h-12 w-48 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (error) {
    return (
      <div className="dash-shell grid min-h-dvh place-items-center p-6 text-sm">
        {error}
      </div>
    );
  }
  if (!data?.profile) {
    return (
      <div className="dash-shell grid min-h-dvh place-items-center">
        <div className="h-12 w-48 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  return <DashCtx.Provider value={{ data, reload }}>{children}</DashCtx.Provider>;
}
