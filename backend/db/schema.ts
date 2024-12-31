import { customType, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { format, startOfDay } from "date-fns";

// Custom type for date (stores as string but returns as Date)
const dateType = customType<{
  data: Date;
  driverData: string;
}>({
  dataType() {
    return "text";
  },
  fromDriver(value: string) {
    return startOfDay(new Date(value));
  },
  toDriver(value: Date) {
    return format(value, "yyyy-MM-dd");
  },
});

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isAdmin: integer("is_admin").notNull(),
});

export const leavePolicies = sqliteTable("leave_policies", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  // No boolean type in sqlite, so we use integer (0/1) instead
  isUnlimited: integer("is_unlimited", { mode: "boolean" }).notNull(),
  allowedDaysPerYear: integer("allowed_days_per_year"),
});

export const leaveRequests = sqliteTable("leave_requests", {
  id: integer("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  leavePolicyId: integer("leave_policy_id")
    .references(() => leavePolicies.id)
    .notNull(),
  startDate: dateType("start_date").notNull(),
  endDate: dateType("end_date").notNull(),
  status: text("status", {
    enum: ["pending", "approved", "rejected"],
  }).notNull(),
});

export const employeesRelations = relations(employees, ({ many }) => ({
  leaveRequests: many(leaveRequests),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employeeId],
    references: [employees.id],
  }),
  leavePolicy: one(leavePolicies, {
    fields: [leaveRequests.leavePolicyId],
    references: [leavePolicies.id],
  }),
}));
