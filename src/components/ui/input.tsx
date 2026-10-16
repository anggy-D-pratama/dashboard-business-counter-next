import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-(color:--border) bg-(--surface) px-3 py-2 text-base text-(color:--fg) file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(color:--fg) placeholder:text-(color:--muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(color:--surface) disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
