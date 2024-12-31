import { ReactNode, createContext, useContext, useMemo } from "react";
import { trpc } from "~/utils/trpc";
import type { AppRouter } from "../../../backend/src/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

const SessionContext = createContext<
  | {
      employee: RouterOutput["employees"]["getCurrentEmployee"];
    }
  | undefined
>(undefined);

export function useCurrentSession() {
  const currentContext = useContext(SessionContext);
  if (!currentContext) {
    throw new Error("You tried to access useCurrentSession without a context");
  }
  return currentContext;
}

export default function Auth(props: { children: ReactNode }) {
  const { data, error } = trpc.employees.getCurrentEmployee.useQuery();

  const sessionContext = useMemo(() => {
    if (data) {
      return {
        employee: data,
      };
    }
  }, [data]);

  if (error) {
    return <div>error</div>;
  }
  if (!data) {
    return <div></div>;
  }

  return <SessionContext.Provider value={sessionContext}>{props.children}</SessionContext.Provider>;
}
