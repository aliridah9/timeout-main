import { z } from "zod";
import { db } from "../../db";
import { router, publicProcedure } from "../trpc";
import {
  employees as employeesTable,
  leavePolicies as leavePoliciesTable,
  leaveRequests as leaveRequestsTable,
  holidays as holidaysTable,
} from "../../db/schema";
import { and, eq, gte, lte, or } from "drizzle-orm";
import { getCurrentEmployeeId } from "../utils/auth";
import { startOfDay, isWeekend, getYear } from "date-fns";
import { getDateDetails, getEntitlements } from "../utils/leave-calculations";

export default router({
  getLeaveRequests: publicProcedure.query(async () => {
    const leaveRequests = await db.query.leaveRequests.findMany({
      with: {
        employee: true,
        leavePolicy: true,
      },
    });

    const results = await Promise.all(
      leaveRequests.map(async (request) => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);

        const workingDays = (
          await getDateDetails({
            leaveRequests: [
              {
                startDate,
                endDate,
                leavePolicy: request.leavePolicy,
              },
            ],
            startDate,
            endDate,
          })
        ).filter((detail) => !isWeekend(detail.date)).length;

        return {
          ...request,
          countWorkingDays: workingDays,
        };
      })
    );

    return results;
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

      // Validation 1: End date must not be earlier than start date
      if (endDate < startDate) {
        throw new Error("End date should be greater or equal to the start date");
      }

      // Fetch all holidays for the period
      const holidays = await db.query.holidays.findMany({
        where: and(gte(holidaysTable.date, startDate), lte(holidaysTable.date, endDate)),
      });

      const workingDays = (
        await getDateDetails({
          startDate,
          endDate,
          holidays,
          leaveRequests: [], // Provide an empty array for leaveRequests
        })
      ).filter((dateDetail) => !dateDetail.isWeekend && dateDetail.type !== "holiday");

      const leaveRequestDays = workingDays.length;

      // Validation 2: Ensure the employee has enough leave days
      const entitlements = await getEntitlements(employee.id, getYear(startDate));
      const leaveEntitlement = entitlements.entitlement.find((e) => e.id === leavePolicy.id);

      if (
        !leaveEntitlement ||
        leaveEntitlement.allowedDaysPerYear === null ||
        leaveEntitlement.allowedDaysPerYear < leaveRequestDays
      ) {
        throw new Error("Leave request exceeds the allowed days");
      }

      // Validation 3: Handle multi-year requests
      const leaveDaysByYear: Record<number, number> = {};
      workingDays.forEach((day) => {
        const year = getYear(day.date);
        if (!leaveDaysByYear[year]) {
          leaveDaysByYear[year] = 0;
        }
        leaveDaysByYear[year]++;
      });

      for (const year in leaveDaysByYear) {
        const yearDays = leaveDaysByYear[year];
        const entitlementForYear = entitlements.entitlement.find((e) => e.id === leavePolicy.id);
        if (
          !entitlementForYear ||
          entitlementForYear.allowedDaysPerYear === null ||
          entitlementForYear.allowedDaysPerYear < yearDays
        ) {
          throw new Error(`Leave request for ${year} exceeds the allowed days`);
        }
      }

      // Create the leave request
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

    const dateDetails = await getDateDetails({
      leaveRequests: leaveRequests.map((request) => ({
        startDate: new Date(request.startDate),
        endDate: new Date(request.endDate),
        leavePolicy: request.leavePolicy,
      })),
      startDate,
      endDate,
    });

    const results = leaveRequests.map((request) => {
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

    return results;
  }),
});
