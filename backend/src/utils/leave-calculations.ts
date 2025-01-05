import {
  employees as employeesTable,
  leaveRequests as leaveRequestsTable,
  holidays as holidaysTable,
} from "../../db/schema";
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
  holidays?: {
    date: Date;
    name: string;
  }[]; // Optional array of holidays
};

export async function getDateDetails({ leaveRequests, startDate, endDate, holidays = [] }: GetDatesProps) {
  // Fetch all holidays within the date range if not provided
  const holidayRecords =
    holidays.length > 0
      ? holidays
      : await db.query.holidays.findMany({
          where: and(gte(holidaysTable.date, startOfDay(startDate)), lte(holidaysTable.date, startOfDay(endDate))),
        });

  const holidayDates = holidayRecords.map((holiday) => holiday.date);

  // Generate an array of all dates within the given range
  const dates = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => startOfDay(date));

  return dates.map((date) => {
    const isWeekendDay = isWeekend(date); // Determine if the date is a weekend
    const isHoliday = holidayDates.some((holidayDate) => isSameDay(holidayDate, date)); // Check if it's a holiday

    // Leave priorities for sorting leave requests
    const leavePriorities: Record<string, number> = {
      "2": 1, // Sick Leave
      "1": 2, // Annual Leave
      "3": 3, // Remote Work
    };

    // Find the relevant leave request for the given date
    const leaveRequest = leaveRequests
      .filter((leaveRequest) => {
        return date >= leaveRequest.startDate && date <= leaveRequest.endDate;
      })
      .sort((a, b) => {
        const priorityA = leavePriorities[`${a.leavePolicy.id}`] ?? 0;
        const priorityB = leavePriorities[`${b.leavePolicy.id}`] ?? 0;
        return priorityA - priorityB;
      })[0];

    // If it's a holiday, return a holiday object
    if (isHoliday) {
      return {
        type: "holiday" as const,
        date,
        holidayName: holidayRecords.find((holiday) => isSameDay(holiday.date, date))?.name,
      };
    }

    // If there's a leave request, return a leave object
    if (leaveRequest) {
      return {
        type: "leave" as const,
        date,
        leavePolicy: leaveRequest.leavePolicy,
        isWeekend: isWeekendDay, // Add isWeekend property
      };
    }

    // Default to work days
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
