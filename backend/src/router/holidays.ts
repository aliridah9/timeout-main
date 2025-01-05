import { router, publicProcedure } from "../trpc";
import { holidays as holidaysTable } from "../../db/schema";
import { and, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";

export default router({
  getHolidaysInRange: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input: { startDate, endDate } }) => {
      // Query the holidays within the date range
      const holidays = await db.query.holidays.findMany({
        where: and(gte(holidaysTable.date, startDate), lte(holidaysTable.date, endDate)),
      });

      return holidays.map((holiday) => ({
        id: holiday.id,
        name: holiday.name,
        date: holiday.date.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      }));
    }),
});
