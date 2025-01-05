import { employees as employeesTable, leaveRequests as leaveRequestsTable, holidays } from "../../db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { LeavePolicy } from "../../db/schema-types";
import { eachDayOfInterval, startOfDay, isWeekend, isSameDay } from "date-fns";
import { db } from "../../db";

type GetDatesProps = {
  leaveRequests: {
    startDate: Date;
    endDate: Date;
    leavePolicy: LeavePolicy;
  }[];
  startDate: Date;
  endDate: Date;
};

export async function getDateDetails({ leaveRequests, startDate, endDate }: GetDatesProps) {
  // Fetch all holidays within the date range
  const holidayRecords = await db.query.holidays.findMany({
    where: and(gte(holidays.date, startOfDay(startDate)), lte(holidays.date, startOfDay(endDate))),
  });

  const holidayDates = holidayRecords.map((holiday) => holiday.date);

  const dates = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => startOfDay(date));

  return dates.map((date) => {
    const isWeekendDay = isWeekend(date); // Determine if the date is a weekend
    const isHoliday = holidayDates.some((holidayDate) => isSameDay(holidayDate, date)); // Check if it's a holiday

    const leavePriorities: Record<string, number> = {
      "2": 1, // Sick Leave
      "1": 2, // Annual Leave
      "3": 3, // Remote Work
    };

    const leaveRequest = leaveRequests
      .filter((leaveRequest) => {
        return date >= leaveRequest.startDate && date <= leaveRequest.endDate;
      })
      .sort((a, b) => {
        if ((leavePriorities[`${a.leavePolicy.id}`] ?? 0) - (leavePriorities[`${b.leavePolicy.id}`] ?? 0) > 0) {
          return 1;
        }
        return -1;
      })[0];

    if (isHoliday) {
      return {
        type: "holiday" as const,
        date,
        holidayName: holidayRecords.find((holiday) => isSameDay(holiday.date, date))?.name,
      };
    }

    if (leaveRequest) {
      return {
        type: "leave" as const,
        date,
        leavePolicy: leaveRequest.leavePolicy,
        isWeekend: isWeekendDay, // Add isWeekend property
      };
    }

    return {
      type: "work" as const,
      date,
      isWeekend: isWeekendDay, // Add isWeekend property
    };
  });
}

export async function getEntitlements(employeeId: number, year: number) {
  if (!employeeId) {
    throw new Error("No employee ID found");
  }

  const startDate = new Date(`${year}/01/01`);
  const endDate = new Date(`${year}/12/31`);
  const employeeQuery = await db.query.employees.findFirst({
    where: eq(employeesTable.id, employeeId),
    with: {
      leaveRequests: {
        where: and(gte(leaveRequestsTable.endDate, startDate), lte(leaveRequestsTable.startDate, endDate)),
        with: {
          leavePolicy: true,
        },
      },
    },
  });

  if (!employeeQuery) {
    throw new Error("No employee found");
  }

  const { leaveRequests, ...employee } = employeeQuery;

  const leavePolicies = await db.query.leavePolicies.findMany();

  const employeeDates = await getDateDetails({ leaveRequests, startDate, endDate });

  type EmployeeEntitlement = LeavePolicy & { alreadyTaken: number };

  const entitlement = leavePolicies.map((leavePolicy) => {
    return {
      ...leavePolicy,
      alreadyTaken: employeeDates.filter(({ type, leavePolicy: lp }) => type === "leave" && lp?.id === leavePolicy.id)
        .length,
    };
  }, {} as Record<string, EmployeeEntitlement>);

  return {
    details: employee,
    entitlement,
  };
}
