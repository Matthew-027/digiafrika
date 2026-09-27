import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardGate } from "@/lib/dash-context";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <DashboardGate>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </DashboardGate>
  );
}
