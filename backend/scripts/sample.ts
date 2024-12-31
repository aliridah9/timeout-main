import { eq, not } from "drizzle-orm";
import { db } from "../db";
import { leaveRequests, employees } from "../db/schema";
import { addDays, subDays } from "date-fns";

const today = new Date();

(async () => {
  await db.delete(leaveRequests);
  await db.delete(employees).where(not(eq(employees.id, 1)));

  db.insert(employees)
    .values([
      {
        email: "ivar@example.com",
        firstName: "Ivar",
        lastName: "The Boneless",
        isAdmin: 0,
        id: 2,
      },
      {
        email: "kingharald@example.com",
        firstName: "Harald",
        lastName: "Finehair",
        isAdmin: 0,
        id: 3,
      },
      {
        email: "theshieldmaiden342@example.com",
        firstName: "Lagertha",
        lastName: "Lothbrok",
        isAdmin: 0,
        id: 4,
      },
      {
        email: "ironside@example.com",
        firstName: "Bjorn",
        lastName: "Ironside",
        isAdmin: 0,
        id: 5,
      },
      {
        email: "hismajestyecby@example.com",
        firstName: "King",
        lastName: "Ecbert",
        isAdmin: 0,
        id: 6,
      },
      {
        email: "cobraeye@example.com",
        firstName: "Sigurd",
        lastName: "Snake-in-the-Eye",
        isAdmin: 0,
        id: 7,
      },
    ])
    .onConflictDoNothing()
    .run();

  db.insert(leaveRequests)
    .values([
      {
        id: 1,
        employeeId: 1,
        // Annual Leave
        leavePolicyId: 1,
        startDate: today,
        endDate: today,
        status: "approved",
      },
      {
        id: 2,
        employeeId: 1,
        // Sick Leave
        leavePolicyId: 2,
        startDate: addDays(today, 1),
        endDate: addDays(today, 3),
        status: "approved",
      },
      {
        id: 3,
        employeeId: 1,
        // Annual Leave
        leavePolicyId: 1,
        startDate: addDays(today, 3),
        endDate: addDays(today, 9),
        status: "approved",
      },
      {
        id: 4,
        employeeId: 2,
        // Remote work
        leavePolicyId: 3,
        startDate: subDays(today, 30),
        endDate: addDays(today, 30),
        status: "approved",
      },
      {
        id: 5,
        employeeId: 3,
        // Annual Leave
        leavePolicyId: 1,
        startDate: addDays(today, 1),
        endDate: addDays(today, 9),
        status: "approved",
      },
      {
        id: 6,
        employeeId: 4,
        // Annual Leave
        leavePolicyId: 1,
        startDate: addDays(today, 1),
        endDate: addDays(today, 9),
        status: "pending",
      },
    ])
    .onConflictDoNothing()
    .run();
})();
