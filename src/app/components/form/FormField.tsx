"use client";

import React, { useEffect, useId, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Fields } from "@/types/formConfig";

export type FormAccent = "student" | "expert";

// ─── Accent palettes ─────────────────────────────────────────────────────────

const ACCENTS = {
  student: {
    focus:
      "focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/15",
    chipHover: "hover:border-purple-300",
    chipOn:
      "peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-checked:text-white",
    chipRing: "peer-focus-visible:ring-purple-500/40",
  },
  expert: {
    focus:
      "focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-500/15",
    chipHover: "hover:border-amber-300",
    chipOn:
      "peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:text-slate-950",
    chipRing: "peer-focus-visible:ring-amber-500/40",
  },
} as const;

type Accent = (typeof ACCENTS)[FormAccent];

// ─── Shared control styling ──────────────────────────────────────────────────

const CONTROL_BASE =
  "w-full rounded-2xl border text-sm sm:text-base outline-none transition-all duration-200 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed";
const CONTROL_ERROR = "border-rose-500 focus:ring-4 focus:ring-rose-500/20";
const CONTROL_IDLE = "border-slate-200 dark:border-slate-700";

interface ControlProps {
  field: Fields;
  accent: Accent;
  hasError: boolean;
  icon?: React.ReactNode;
  controlId: string;
}

/** Placeholder falls back to a sentence built from the label. */
const placeholderFor = (field: Fields) =>
  field.placeholder || `Enter your ${field.label.toLowerCase()}`;

const controlClass = (
  accent: Accent,
  hasError: boolean,
  ...extra: string[]
) =>
  cn(CONTROL_BASE, hasError ? CONTROL_ERROR : cn(CONTROL_IDLE, accent.focus), ...extra);

/**
 * `number` inputs must be registered with valueAsNumber or RHF hands the
 * schema a string and zod's z.number() rejects it.
 */
const registerOptions = (field: Fields) => ({
  valueAsNumber: field.valueAsNumber ?? field.type === "number",
  disabled: field.disabled,
});

// ─── Controls ────────────────────────────────────────────────────────────────

function InputControl({
  field,
  accent,
  hasError,
  icon,
  controlId,
}: ControlProps) {
  const { register } = useFormContext();

  return (
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3.5 pointer-events-none">{icon}</div>}
      <input
        id={controlId}
        type={field.type}
        placeholder={placeholderFor(field)}
        {...register(field.name, registerOptions(field))}
        className={controlClass(
          accent,
          hasError,
          "py-3",
          icon ? "pl-10 pr-4" : "px-3.5"
        )}
      />
    </div>
  );
}

function PasswordControl({
  field,
  accent,
  hasError,
  icon,
  controlId,
}: ControlProps) {
  const { register } = useFormContext();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3.5 pointer-events-none">{icon}</div>}
      <input
        id={controlId}
        type={visible ? "text" : "password"}
        placeholder={placeholderFor(field)}
        {...register(field.name, registerOptions(field))}
        className={controlClass(
          accent,
          hasError,
          "py-3 pr-10",
          icon ? "pl-10" : "pl-3.5"
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function TextareaControl({ field, accent, hasError, controlId }: ControlProps) {
  const { register } = useFormContext();

  return (
    <textarea
      id={controlId}
      rows={3}
      placeholder={placeholderFor(field)}
      {...register(field.name, { disabled: field.disabled })}
      className={controlClass(accent, hasError, "p-3.5 resize-y min-h-[88px]")}
    />
  );
}

/** Renders a multi-select group of chips; RHF collects them into an array. */
function CheckboxGroupControl({ field, accent, hasError }: ControlProps) {
  const { register } = useFormContext();
  const options = useFieldOptions(field);

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        hasError && "rounded-2xl ring-2 ring-rose-500/20 p-1"
      )}
    >
      {options.map((option) => (
        <label
          key={String(option.value)}
          className="cursor-pointer select-none"
        >
          <input
            type="checkbox"
            value={option.value}
            disabled={field.disabled}
            {...register(field.name)}
            className="peer sr-only"
          />
          <span
            className={cn(
              "inline-block px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 transition-all peer-checked:shadow-sm peer-focus-visible:ring-2",
              accent.chipHover,
              accent.chipOn,
              accent.chipRing
            )}
          >
            {option.label ?? String(option.value)}
          </span>
        </label>
      ))}
    </div>
  );
}

function SelectControl({ field, accent, hasError, controlId }: ControlProps) {
  const { register } = useFormContext();
  const options = useFieldOptions(field);

  return (
    <select
      id={controlId}
      {...register(field.name, registerOptions(field))}
      className={controlClass(accent, hasError, "py-3 px-3.5 appearance-none")}
    >
      <option value="">{placeholderFor(field)}</option>
      {options.map((option) => (
        <option key={String(option.value)} value={option.value}>
          {option.label ?? String(option.value)}
        </option>
      ))}
    </select>
  );
}

/**
 * Registry of field types → control. **To support a new field type, add one
 * entry here** — every form in the app picks it up. Anything unlisted falls
 * through to `InputControl`, which honours the native `type` (text, email,
 * date, time, tel, url, …).
 */
const CONTROLS: Record<string, React.ComponentType<ControlProps>> = {
  password: PasswordControl,
  textarea: TextareaControl,
  checkbox: CheckboxGroupControl,
  select: SelectControl,
};

/** Types whose label describes a group of inputs rather than one element. */
const GROUP_TYPES = new Set(["checkbox", "radio"]);

/** Types that always want a full row in a two-column grid. */
export const FULL_WIDTH_TYPES = new Set(["textarea", "checkbox", "radio"]);

// ─── Options loading (static or async) ───────────────────────────────────────

type Option = { label?: string; value?: string | number };

function useFieldOptions(field: Fields): Option[] {
  const [options, setOptions] = useState<Option[]>(field.options ?? []);
  const { asyncOptions } = field;

  useEffect(() => {
    if (!asyncOptions) return;
    let cancelled = false;
    asyncOptions()
      .then((res) => {
        if (!cancelled) setOptions(res);
      })
      .catch((err) => console.warn("Failed to load field options:", err));
    return () => {
      cancelled = true;
    };
  }, [asyncOptions]);

  return options;
}

// ─── Public component ────────────────────────────────────────────────────────

export interface FormFieldProps {
  field: Fields;
  accent?: FormAccent;
  /** Leading icon, rendered inside single-line inputs. */
  icon?: React.ReactNode;
  className?: string;
}

/**
 * One labelled, error-aware form control driven by a `Fields` config entry.
 * Reads `register`/`errors` off the surrounding `FormProvider`.
 */
export default function FormField({
  field,
  accent = "student",
  icon,
  className,
}: FormFieldProps) {
  const { formState } = useFormContext();
  const error = get(formState.errors, field.name) as
    | { message?: string }
    | undefined;
  const hasError = !!error;

  const controlId = `${useId()}-${field.name}`;
  const Control = CONTROLS[field.type] ?? InputControl;
  const isGroup = GROUP_TYPES.has(field.type);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={isGroup ? undefined : controlId}
        className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
      >
        <span>{field.label}</span>
        {field.required && <span className="text-rose-500 font-normal">*</span>}
      </label>

      <Control
        field={field}
        accent={ACCENTS[accent]}
        hasError={hasError}
        icon={icon}
        controlId={controlId}
      />

      {hasError && (
        <p className="text-rose-500 text-xs font-medium px-1">
          {error?.message}
        </p>
      )}
    </div>
  );
}
