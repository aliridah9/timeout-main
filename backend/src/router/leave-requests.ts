import { z } from "zod";
import { db } from "../../db";
import { router, publicProcedure } from "../trpc";
import {
  employees as employeesTable,
  leavePolicies as leavePoliciesTable,
  leaveRequests as leaveRequestsTable,
} from "../../db/schema";
import { eq, or } from "drizzle-orm";
import { getCurrentEmployeeId } from "../utils/auth";
import { startOfDay, isWeekend } from "date-fns";
import { getDateDetails } from "../utils/leave-calculations";

export default router({
  getLeaveRequests: publicProcedure.query(async () => {
    const leaveRequests = await db.query.leaveRequests.findMany({
      with: {
        employee: true,
        leavePolicy: true,
      },
    });

    return leaveRequests.map((request) => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const workingDays = getDateDetails({
        leaveRequests: [
          {
            startDate,
            endDate,
            leavePolicy: request.leavePolicy,
          },
        ],
        startDate,
        endDate,
      }).filter((detail) => !isWeekend(detail.date)).length;

      return {
        ...request,
        countWorkingDays: workingDays,
      };
    });
  }),
  createLeaveRequest: publicProcedure
    .input(
      z.object({
        leavePolicyId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const employee = await db.query.employees.findFirst({
        where: eq(employeesTable.id, getCurrentEmployeeId()),
      });
      if (!employee) {
        throw new Error("No employee found");
      }

      const leavePolicy = await db
        .select()
        .from(leavePoliciesTable)
        .where(eq(leavePoliciesTable.id, input.leavePolicyId))
        .get();

      if (!leavePolicy) {
        throw new Error("No leave policy found");
      }

      const startDate = startOfDay(new Date(input.startDate));
      const endDate = startOfDay(new Date(input.endDate));

      return await db
        .insert(leaveRequestsTable)
        .values({
          employeeId: employee.id,
          leavePolicyId: leavePolicy.id,
          startDate,
          endDate,
          status: "pending",
        })
        .returning();
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      const leaveRequest = await db.query.leaveRequests.findFirst({
        where: eq(leaveRequestsTable.id, input.id),
      });

      if (!leaveRequest) {
        throw new Error("Leave request not found");
      }

      await db.update(leaveRequestsTable).set({ status: input.status }).where(eq(leaveRequestsTable.id, input.id));

      return { success: true, status: input.status };
    }),

  getDashboardLeaveRequests: publicProcedure.query(async () => {
    const leaveRequests = await db.query.leaveRequests.findMany({
      with: {
        employee: true,
        leavePolicy: true,
      },
      where: or(eq(leaveRequestsTable.status, "pending"), eq(leaveRequestsTable.status, "approved")),
    });

    const startDate = new Date(`${new Date().getFullYear()}-01-01`);
    const endDate = new Date(`${new Date().getFullYear()}-12-31`);

    const dateDetails = getDateDetails({
      leaveRequests: leaveRequests.map((request) => ({
        startDate: new Date(request.startDate),
        endDate: new Date(request.endDate),
        leavePolicy: request.leavePolicy,
      })),
      startDate,
      endDate,
    });

    return leaveRequests.map((request) => {
      const totalDaysTaken = dateDetails.filter(
        (detail) =>
          detail.type === "leave" &&
          detail.leavePolicy?.id === request.leavePolicy.id &&
          detail.date >= new Date(request.startDate) &&
          detail.date <= new Date(request.endDate)
      ).length;

      return {
        ...request,
        totalDaysTaken,
      };
    });
  }),
});
