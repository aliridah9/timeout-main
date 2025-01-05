import { InferSelectModel } from "drizzle-orm";
import { employees, leavePolicies, leaveRequests, holidays } from "./schema";

export type Employee = InferSelectModel<typeof employees>;
export type LeaveRequest = InferSelectModel<typeof leaveRequests>;
export type LeavePolicy = InferSelectModel<typeof leavePolicies>;
export type Holiday = InferSelectModel<typeof holidays>;
