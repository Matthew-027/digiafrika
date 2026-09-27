import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  side = "left",
  ...props
}: ComponentProps<typeof Dialog.Content> & { side?: "left" | "right" }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn(
          "fixed z-50 flex h-full w-[min(20rem,88vw)] flex-col border-border bg-paper p-5 shadow-[var(--shadow-soft)]",
          side === "left" ? "left-0 top-0 border-r" : "right-0 top-0 border-l",
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-[10px] hover:bg-secondary">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title className={cn("font-display text-lg font-semibold", className)} {...props} />;
}
