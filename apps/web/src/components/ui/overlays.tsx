"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = ({ className, align = "center", sideOffset = 8, ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn("z-50 rounded-2xl border border-border/70 bg-popover p-4 shadow-strong backdrop-blur-xl outline-none", className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
);

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = ({ className, sideOffset = 6, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={cn("z-50 rounded-lg border border-border/70 bg-popover px-3 py-2 text-xs text-popover-foreground shadow-strong backdrop-blur-xl", className)}
      {...props}
    />
  </TooltipPrimitive.Portal>
);

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;
export const DialogOverlay = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-overlay/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />
);
export const DialogContent = ({ className, children, showClose = true, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showClose?: boolean }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-[min(92vw,48rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-3xl border border-border/70 bg-background/95 p-6 shadow-strong backdrop-blur-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    >
      {children}
      {showClose ? (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground">
          <X className="size-4" aria-hidden="true" />
        </DialogPrimitive.Close>
      ) : null}
    </DialogPrimitive.Content>
  </DialogPortal>
);

export function Drawer({ children, open, onOpenChange }: React.PropsWithChildren<{ open: boolean; onOpenChange: (open: boolean) => void }>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

export function Sheet({ children, open, onOpenChange }: React.PropsWithChildren<{ open: boolean; onOpenChange: (open: boolean) => void }>) {
  return <Drawer open={open} onOpenChange={onOpenChange}>{children}</Drawer>;
}

export const DrawerContent = ({ className, side = "right", ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: "left" | "right" | "top" | "bottom" }) => {
  const sideClasses = {
    right: "right-0 top-0 h-full w-[min(92vw,28rem)] border-l",
    left: "left-0 top-0 h-full w-[min(92vw,28rem)] border-r",
    top: "left-0 top-0 h-[min(92vh,28rem)] w-full border-b",
    bottom: "left-0 bottom-0 h-[min(92vh,28rem)] w-full border-t",
  } as const;

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-background/96 p-6 shadow-strong backdrop-blur-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          sideClasses[side],
          className,
        )}
        {...props}
      />
    </DialogPortal>
  );
};

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = ({ className, sideOffset = 8, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content className={cn("z-50 min-w-56 rounded-2xl border border-border/70 bg-popover p-2 shadow-strong backdrop-blur-xl", className)} sideOffset={sideOffset} {...props} />
  </DropdownMenuPrimitive.Portal>
);
export const DropdownMenuItem = ({ className, inset, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-muted/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
);
export const DropdownMenuSeparator = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator className={cn("my-2 h-px bg-border", className)} {...props} />
);
export const DropdownMenuLabel = ({ className, inset, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) => (
  <DropdownMenuPrimitive.Label className={cn("px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground", inset && "pl-8", className)} {...props} />
);
export const DropdownMenuSubTrigger = ({ className, inset, children, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      "flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-muted/70 data-[state=open]:bg-muted/70",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <ChevronRight className="size-4" aria-hidden="true" />
  </DropdownMenuPrimitive.SubTrigger>
);
