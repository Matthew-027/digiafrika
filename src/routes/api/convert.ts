import { createFileRoute } from "@tanstack/react-router";
import { ingestConversionCore } from "@/lib/server/platform";

export const Route = createFileRoute("/api/convert")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            code?: string;
            orderRef?: string;
            amountNgn?: number;
            secret?: string;
          };
          const result = await ingestConversionCore({
            code: String(body.code ?? ""),
            orderRef: body.orderRef,
            amountNgn: body.amountNgn,
            secret: String(body.secret ?? ""),
          });
          return Response.json({ ok: true, ...result });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Conversion failed";
          const status = message.includes("Invalid") || message.includes("Unknown") ? 400 : 500;
          return Response.json({ ok: false, error: message }, { status });
        }
      },
    },
  },
});
