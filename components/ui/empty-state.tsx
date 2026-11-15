import { ReactNode } from "react";

/** Centered message for empty lists and failed loads, with an optional next step. */
export function EmptyState({
  title,
  body,
  action,
  headingLevel: Heading = "h1",
}: {
  title: ReactNode;
  body: ReactNode;
  action?: ReactNode;
  headingLevel?: "h1" | "h2";
}) {
  return (
    <div className="py-24 text-center">
      <Heading className="text-3xl font-semibold font-stretch-condensed tracking-tight">{title}</Heading>
      <p className="mx-auto mt-2 max-w-md text-usher">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
