import * as Progress from "@radix-ui/react-progress";
import { trpc } from "../../utils/trpc";
import { motion } from "framer-motion";

type EntitlementBarsProps = {
  display?: "default" | "compact";
};

const ColorClassByLabel: Record<string, string> = {
  "Annual Leave": "bg-purple",
  "Sick Leave": "bg-yellow-dark",
  "Remote Work": "bg-blue",
};

export function EntitlementBars({ display = "default" }: EntitlementBarsProps) {
  // Fetch filtered leave requests for the dashboard
  const leaveRequestsQuery = trpc.leaveRequests.getDashboardLeaveRequests.useQuery();

  if (leaveRequestsQuery.isLoading) {
    return (
      <div className={`flex h-full flex-col justify-between ${display === "compact" && "gap-y-4"} py-8`}>
        {[...Array(3)].map((_, index) => (
          <div key={index}>
            <LoadingEntitlementBar display={display} />
          </div>
        ))}
      </div>
    );
  }

  if (leaveRequestsQuery.error) {
    return <div className="text-red">Error: {leaveRequestsQuery.error.message}</div>;
  }

  const leaveRequests = leaveRequestsQuery.data || [];

  // Group leave requests by policy and calculate the total days taken
  const entitlementMap: Record<string, { taken: number; max: number; isUnlimited: boolean }> = {};

  leaveRequests.forEach((request) => {
    const { title, allowedDaysPerYear, isUnlimited } = request.leavePolicy;

    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    const daysTaken = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

    if (!entitlementMap[title]) {
      entitlementMap[title] = {
        taken: 0,
        max: isUnlimited ? Infinity : allowedDaysPerYear ?? 0,
        isUnlimited: !!isUnlimited,
      };
    }

    entitlementMap[title].taken += daysTaken;
  });

  return (
    <div className={`flex h-full flex-col justify-between ${display === "compact" && "gap-y-4"} py-8`}>
      {Object.entries(entitlementMap).map(([title, { taken, max }]) => (
        <EntitlementBar
          key={title}
          label={title}
          colorClass={ColorClassByLabel[title] ?? "bg-gray-400"}
          taken={taken}
          max={max}
          display={display}
        />
      ))}
    </div>
  );
}

function LoadingEntitlementBar(props: { display: "default" | "compact" }) {
  const isCompact = props.display === "compact";

  return (
    <EntitlementGrid
      display={props.display}
      bar={
        <motion.div
          animate={{ backgroundPosition: "400px 0" }}
          initial={{ backgroundPosition: "-400px 0" }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className={`relative  ${isCompact ? "h-2 bg-gray-light-2" : "h-5 bg-gray-light"} overflow-hidden rounded`}
          style={{
            // Fix overflow clipping in Safari
            // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
            transform: "translateZ(0)",
            backgroundImage: isCompact
              ? "linear-gradient(to right, #C7C7C9 0%, #B1B1B3 35%, #C7C7C9 65%, #C7C7C9 100%)"
              : "linear-gradient(to right, #E4E4E4 0%, #F4F4F4 35%, #E4E4E4 65%, #E4E4E4 100%)",
            backgroundColor: isCompact ? "#C7C7C9" : "#E4E4E4",
            backgroundSize: "700px 700px",
            backgroundRepeat: "no-repeat",
          }}
        ></motion.div>
      }
    />
  );
}

function EntitlementBar(props: {
  colorClass: string;
  taken: number;
  max: number;
  label: string;
  display: "compact" | "default";
}) {
  const isCompact = props.display === "compact";
  const remaining = Math.max(0, props.max - props.taken);
  const remainingText = remaining === Infinity ? "Unlimited" : `${remaining} days left`;

  const numericMax = props.max === Infinity ? 100 : props.max;
  const numericRemaining = remaining === Infinity ? 100 : remaining;
  const remainingPercentage = (numericRemaining / numericMax) * 100;

  return (
    <EntitlementGrid
      display={props.display}
      label={props.label}
      bar={
        <Progress.Root
          value={numericRemaining}
          max={numericMax}
          className={`relative  ${isCompact ? "h-2 bg-gray-light-2" : "h-5 bg-gray-light"} overflow-hidden rounded `}
          style={{
            // Fix overflow clipping in Safari
            // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
            transform: "translateZ(0)",
          }}
        >
          <Progress.Indicator
            className={`h-full w-full animate-grow-x rounded transition-all ${props.colorClass}`}
            style={{ width: `${remainingPercentage}%` }}
          />
        </Progress.Root>
      }
      remaining={remainingText}
    />
  );
}

function EntitlementGrid(props: {
  label?: React.ReactNode;
  remaining?: React.ReactNode;
  bar: React.ReactNode;
  display: "default" | "compact";
}) {
  const isCompact = props.display === "compact";
  const gridStyle = (
    {
      compact: {
        gridTemplateAreas: `
            'label remaining'
            'bar   bar'
          `,
        gridTemplateColumns: "1fr 1fr",
      },
      default: {
        gridTemplateAreas: `'label bar . remaining'`,
        gridTemplateColumns: "100px 1fr 16px 100px",
      },
    } as const
  )[props.display];

  return (
    <div className="grid" style={gridStyle}>
      <div className={`text-sm ${isCompact && "text-gray-text"}`} style={{ gridArea: "label" }}>
        {props.label}
      </div>
      <div style={{ gridArea: "bar" }}>{props.bar}</div>
      <div
        className={`text-sm ${isCompact ? "text-right font-bold text-black" : "text-gray-text"}`}
        style={{ gridArea: "remaining" }}
        data-testid={"entitlement-remaining-" + props.label}
      >
        {props.remaining}
      </div>
    </div>
  );
}
