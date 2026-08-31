"use client";

import React from "react";
import { Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Fields } from "@/types/formConfig";
import FormField, { FULL_WIDTH_TYPES, type FormAccent } from "./FormField";

const ICON_CLASS = "w-4 h-4 text-slate-400 dark:text-slate-500";

/**
 * Leading icons keyed by field name. Add an entry here and every form that
 * uses that field name picks it up; pass `icons` to override per form.
 */
const DEFAULT_ICONS: Record<string, React.ReactNode> = {
  full_name: <User className={ICON_CLASS} />,
  email: <Mail className={ICON_CLASS} />,
  password: <Lock className={ICON_CLASS} />,
  confirm_password: <ShieldCheck className={ICON_CLASS} />,
  phone: <Phone className={ICON_CLASS} />,
};

export interface FormFieldsProps {
  fields: Fields[];
  accent?: FormAccent;
  /** 1 = stacked, 2 = two-up on `sm` and above. */
  columns?: 1 | 2;
  /** Per-field icon overrides, keyed by field name. `null` removes one. */
  icons?: Record<string, React.ReactNode | null>;
  /** Set false to drop the built-in icons entirely. */
  withIcons?: boolean;
  className?: string;
}

/**
 * Renders a whole `Fields[]` config. Textareas and checkbox groups span the
 * full row; anything else honours `colSpan` from the config.
 */
export default function FormFields({
  fields,
  accent = "student",
  columns = 1,
  icons,
  withIcons = true,
  className,
}: FormFieldsProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className
      )}
    >
      {fields.map((field) => {
        const override = icons?.[field.name];
        const icon =
          override !== undefined
            ? override
            : withIcons
            ? DEFAULT_ICONS[field.name]
            : undefined;

        const spansRow =
          FULL_WIDTH_TYPES.has(field.type) || field.colSpan === 2;

        return (
          <FormField
            key={field.name}
            field={field}
            accent={accent}
            icon={icon ?? undefined}
            className={
              columns === 2 && spansRow ? "sm:col-span-2" : undefined
            }
          />
        );
      })}
    </div>
  );
}
