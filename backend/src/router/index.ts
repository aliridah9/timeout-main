import { router } from "../trpc";
import EmployeesRouter from "./employees";
import holidays from "./holidays";
import LeavePolicies from "./leave-policies";
import LeaveRequests from "./leave-requests";

type AppRouter = typeof appRouter;

const appRouter = router({
  employees: EmployeesRouter,
  leavePolicies: LeavePolicies,
  leaveRequests: LeaveRequests,
  holidays: holidays,
});

export default appRouter;
export type { AppRouter };
