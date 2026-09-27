import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useDash } from "@/lib/dash-context";
import { DESK_HOME } from "@/lib/roles";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

function Overview() {
  const { data } = useDash();
  return <Navigate to={DESK_HOME[data.profile.deskRole]} />;
}
