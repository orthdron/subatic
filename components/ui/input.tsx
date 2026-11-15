import * as React from "react";

import { cn } from "@/lib/utils";

/** Shared look for text inputs and textareas. 16px text on phones avoids iOS zoom. */
export const fieldControlClass =
  "w-full rounded-md border border-rail bg-stage px-3 text-base text-screen transition-colors placeholder:text-usher/70 hover:border-[#3d3945] focus-visible:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-signal sm:text-sm";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return <input type={type} className={cn(fieldControlClass, "h-10", className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
