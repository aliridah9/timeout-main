import ApplyDialog from "~/app/route-index/apply-dialog";
import { EntitlementBars } from "./entitlement-bars";

export default function IndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-black-dark">Dashboard</h1>
      <div className="max-w-screen-xl pt-16">
        <EntitlementCard />
      </div>
    </div>
  );
}

function Card(props: { title: string; action: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="h-64 rounded-3xl bg-white p-6">
      <div className="flex h-full flex-col">
        <div className="flex w-full">
          <h1 className="flex-1 text-xl">{props.title}</h1>
          <div className="flex items-center">{props.action}</div>
        </div>
        <div className="flex-1">{props.children}</div>
      </div>
    </div>
  );
}

function EntitlementCard() {
  return (
    <Card
      title="Entitlement"
      action={
        <ApplyDialog
          trigger={
            <button
              type="button"
              data-testid="apply-for-leave-button"
              className="flex h-9 items-center rounded-3xl border border-blue px-8
              text-sm text-blue outline-none transition-colors duration-300
                hover:bg-blue hover:text-white
                focus:ring-2 focus:ring-blue
                active:opacity-60 active:transition-none"
            >
              Apply for Request
            </button>
          }
        />
      }
    >
      <EntitlementBars />
    </Card>
  );
}
