import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { leaveRequests as leaveRequestsTable } from "../../db/schema";
import { and, gte, lte } from "drizzle-orm";
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
    .query(async (obj) => {
      let {
        input: { startDate, endDate },
      } = obj;

      let employees = await db.query.employees.findMany({
        with: {
          leaveRequests: {
            where: and(lte(leaveRequestsTable.startDate, endDate), gte(leaveRequestsTable.endDate, startDate)),
            with: {
              leavePolicy: true,
            },
          },
        },
      });

      return employees.map((item) => {
        const { leaveRequests, ...employee } = item;
        return {
          employee,
          dates: getDateDetails({ leaveRequests, startDate, endDate }),
        };
      });
    }),
});
