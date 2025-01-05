import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { leaveRequests as leaveRequestsTable } from "../../db/schema";
import { and, gte, lte, eq } from "drizzle-orm";
import { getYear } from "date-fns";
import { db } from "../../db";
import { getCurrentEmployeeId } from "../utils/auth";
import { getDateDetails, getEntitlements } from "../utils/leave-calculations";

export default router({
  getCurrentEmployee: publicProcedure.query(async () => {
    const currentYear = getYear(new Date());
    return getEntitlements(getCurrentEmployeeId(), currentYear);
  }),
  getTimeSheet: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input: { startDate, endDate } }) => {
      // Fetch all employees along with their leave requests
      const employees = await db.query.employees.findMany({
        with: {
          leaveRequests: {
            where: and(
              lte(leaveRequestsTable.startDate, endDate),
              gte(leaveRequestsTable.endDate, startDate),
              eq(leaveRequestsTable.status, "approved") // Only approved leaves
            ),
            with: {
              leavePolicy: true, // Include leave policy details
            },
          },
        },
      });

      // Process timesheet data for all employees
      const result = await Promise.all(
        employees.map(async (employee) => {
          const { leaveRequests, ...rest } = employee;

          // Calculate detailed dates using getDateDetails
          const dates = await getDateDetails({
            leaveRequests,
            startDate,
            endDate,
          });

          return {
            employee: rest, // Return employee details
            dates, // Return processed dates
          };
        })
      );

      return result; // Return the final processed timesheet data for all employees
    }),
});
