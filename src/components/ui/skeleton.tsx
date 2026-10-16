import type { HTMLAttributes } from "react";

/**
 * shadcn/ui-style Skeleton primitive (copy-paste, no new dependency).
 * Visual tokens (background + shimmer) live in app/globals.css so all
 * colors come from globals.css tokens, never hardcoded literals.
 */
export function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={className ? `skeleton ${className}` : "skeleton"}
      {...props}
    />
  );
}
