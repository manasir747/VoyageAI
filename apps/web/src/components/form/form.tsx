"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
  useForm,
  useFormContext,
} from "react-hook-form";
import type { ZodTypeAny } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FormItemContext = React.createContext<{ id: string } | null>(null);
const FormFieldContext = React.createContext<{ name: string } | null>(null);

export function Form({ children, ...props }: React.ComponentProps<typeof FormProvider>) {
  return <FormProvider {...props}>{children}</FormProvider>;
}

export function useZodForm<TSchema extends ZodTypeAny>({
  schema,
  defaultValues,
  mode = "onTouched",
}: {
  schema: TSchema;
  defaultValues?: Record<string, unknown>;
  mode?: "onBlur" | "onChange" | "onSubmit" | "all" | "onTouched";
}) {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  }) as UseFormReturn<FieldValues>;
}

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-foreground text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

export function FormControl({ children, ...props }: React.ComponentPropsWithoutRef<typeof Slot>) {
  const formItemContext = React.useContext(FormItemContext);
  const formFieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = formFieldContext ? getFieldState(formFieldContext.name, formState) : null;

  return (
    <Slot
      aria-invalid={fieldState?.invalid || undefined}
      aria-describedby={
        formItemContext
          ? `${formItemContext.id}-description ${formItemContext.id}-message`
          : undefined
      }
      {...props}
    >
      {children}
    </Slot>
  );
}

export function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const formItemContext = React.useContext(FormItemContext);
  return (
    <p
      id={formItemContext ? `${formItemContext.id}-description` : undefined}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const formItemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const formFieldContext = React.useContext(FormFieldContext);
  const fieldState = formFieldContext ? getFieldState(formFieldContext.name, formState) : null;
  const body = children ?? fieldState?.error?.message;

  if (!body) return null;

  return (
    <p
      id={formItemContext ? `${formItemContext.id}-message` : undefined}
      className={cn("text-error text-sm font-medium", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export function FormFieldShell({ name, children }: React.PropsWithChildren<{ name: string }>) {
  return <FormFieldContext.Provider value={{ name }}>{children}</FormFieldContext.Provider>;
}

export function FormErrorSummary({ className }: { className?: string }) {
  const { formState } = useFormContext();
  const errors = Object.values(formState.errors);

  if (!errors.length) return null;

  return (
    <div className={cn("border-error/20 bg-error/10 rounded-2xl border p-4", className)}>
      <div className="flex items-start gap-3">
        <CircleAlert className="text-error mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-foreground font-medium">Please fix the highlighted fields</p>
          <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
            {errors.map((error, index) => (
              <li key={index}>{String(error?.message ?? "Invalid field")}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function FormSubmit({
  loading,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
    <Button type="submit" disabled={loading || props.disabled} className={className} {...props}>
      {loading ? <CheckCircle2 className="size-4 animate-pulse" aria-hidden="true" /> : null}
      {children}
    </Button>
  );
}
