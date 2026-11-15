import { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A labelled form control with optional help text underneath. */
export function Field({
  label,
  htmlFor,
  hint,
  hintId,
  className,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
  /** Pass the same id to the control's aria-describedby. */
  hintId?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-screen">
        {label}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-[13px] leading-snug text-usher">
          {hint}
        </p>
      )}
    </div>
  );
}
