import { ReactNode } from "react";

export function ClockCard(props: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="flex h-full flex-col">
        <div className="flex w-full">
          <h1 className="flex-1 text-xl" data-testid="clock-title">
            {props.title}
          </h1>
        </div>
        <div className="flex-1">{props.children}</div>
      </div>
    </div>
  );
}
