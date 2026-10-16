import * as React from "react";

function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton ${className}`.trim()}
      {...props}
    />
  );
}

export { Skeleton };
