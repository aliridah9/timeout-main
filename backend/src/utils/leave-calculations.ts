import { employees as employeesTable, leaveRequests as leaveRequestsTable } from "../../db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { LeavePolicy } from "../../db/schema-types";
import { eachDayOfInterval, startOfDay, isWithinInterval } from "date-fns";
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

export function getDateDetails({ leaveRequests, startDate, endDate }: GetDatesProps) {
  const dates = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => startOfDay(date));

  return dates.map((date) => {
    const leavePriorities: Record<string, number> = {
      // Sick Leave
      "2": 1,
      // Annual leave
      "1": 2,
      // Remote work
      "3": 3,
    };
    // Sort leave requests by priority and take the first one. If two leaves
    // have an overlapping date we prefer the one with higher priority
    const leaveRequest = leaveRequests
      .filter((leaveRequest) => {
        return isWithinInterval(date, {
          start: leaveRequest.startDate,
          end: leaveRequest.endDate,
        });
      })
      .sort((a, b) => {
        if ((leavePriorities[`${a.leavePolicy.id}`] ?? 0) - (leavePriorities[`${b.leavePolicy.id}`] ?? 0) > 0) {
          return 1;
        }
        return -1;
      })[0];

    if (leaveRequest) {
      return {
        type: "leave" as const,
        date,
        leavePolicy: leaveRequest.leavePolicy,
      };
    }
    return {
      type: "work" as const,
      date,
    };
  });
}

export async function getEntitlements(employeeId: number, year: number) {
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

  const employeeDates = getDateDetails({ leaveRequests, startDate, endDate });

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
