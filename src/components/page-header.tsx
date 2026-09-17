import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-[#d9d9d3] pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#202833]">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#68717d]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
