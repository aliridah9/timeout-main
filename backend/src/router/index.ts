import { router } from "../trpc";
import EmployeesRouter from "./employees";
import LeavePolicies from "./leave-policies";
import LeaveRequests from "./leave-requests";

type AppRouter = typeof appRouter;

const appRouter = router({
  employees: EmployeesRouter,
  leavePolicies: LeavePolicies,
  leaveRequests: LeaveRequests,
});

export default appRouter;
export type { AppRouter };
