"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDown, Eye, EyeOff, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputBaseClass =
  "flex h-11 w-full rounded-lg border border-border/70 bg-background/80 px-4 py-2 text-sm text-foreground shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type = "text", ...props }, ref) => {
  return <input ref={ref} type={type} className={cn(inputBaseClass, className)} {...props} />;
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return <textarea ref={ref} className={cn(inputBaseClass, "min-h-28 py-3", className)} {...props} />;
});
Textarea.displayName = "Textarea";

export function PasswordInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input className={cn("pr-11", className)} type={visible ? "text" : "password"} {...props} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input className={cn("pl-10", className)} type="search" {...props} />
    </div>
  );
}

export function OtpInput({ length = 6, value, onChange, className }: { length?: number; value?: string; onChange?: (value: string) => void; className?: string }) {
  const digits = React.useMemo(() => Array.from({ length }, (_, index) => value?.[index] ?? ""), [length, value]);
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, nextValue: string) => {
    const nextDigits = [...digits];
    nextDigits[index] = nextValue.slice(-1);
    onChange?.(nextDigits.join(""));
    if (nextValue && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-2", className)} aria-label="One-time password input">
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-12 text-center text-lg font-semibold"
        />
      ))}
    </div>
  );
}

export type SelectOption = { label: string; value: string; disabled?: boolean };

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  className,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        className={cn(inputBaseClass, "appearance-none pr-10")}
        aria-label={placeholder}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

function filterOptions<T extends SelectOption>(options: T[], query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return options;
  return options.filter((option) => option.label.toLowerCase().includes(search) || option.value.toLowerCase().includes(search));
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Search...",
  emptyLabel = "No results found",
  className,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  emptyLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const filteredOptions = React.useMemo(() => filterOptions(options, query), [options, query]);
  const activeOption = options.find((option) => option.value === value);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={cn(inputBaseClass, "justify-between text-left", className)}>
          <span className={cn("truncate", !activeOption && "text-muted-foreground")}>{activeOption?.label ?? placeholder}</span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content className="z-50 w-[var(--radix-popover-trigger-width)] rounded-2xl border border-border/70 bg-popover p-2 shadow-strong backdrop-blur-xl" align="start" sideOffset={8}>
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="mb-2" />
          <div role="listbox" className="max-h-72 overflow-auto rounded-xl">
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  disabled={option.disabled}
                  onClick={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/70",
                    option.value === value && "bg-primary/10 text-primary",
                    option.disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <span>{option.label}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyLabel}</div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export function Autocomplete({
  value,
  onValueChange,
  options,
  placeholder = "Type to search...",
  emptyLabel = "No matches",
  className,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  emptyLabel?: string;
  className?: string;
}) {
  const [query, setQuery] = React.useState(value ?? "");
  const [open, setOpen] = React.useState(false);
  const filteredOptions = React.useMemo(() => filterOptions(options, query), [options, query]);

  React.useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <div className={cn("relative", className)}>
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            placeholder={placeholder}
            className="pr-10"
          />
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        </div>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content className="z-50 w-[var(--radix-popover-trigger-width)] rounded-2xl border border-border/70 bg-popover p-2 shadow-strong backdrop-blur-xl" align="start" sideOffset={8}>
          <div role="listbox" className="max-h-72 overflow-auto rounded-xl">
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    setQuery(option.label);
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/70",
                    option.value === value && "bg-primary/10 text-primary",
                  )}
                >
                  <span>{option.label}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyLabel}</div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
