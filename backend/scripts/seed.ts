import { db } from "../db";
import { employees, leavePolicies, holidays } from "../db/schema";

// Seed employees
db.insert(employees)
  .values([
    {
      email: "ragnar@example.com",
      firstName: "Ragnar",
      lastName: "Lothbrok",
      isAdmin: 1,
      id: 1,
    },
  ])
  .onConflictDoNothing()
  .run();

// Seed leave policies
db.insert(leavePolicies)
  .values([
    {
      title: "Annual Leave",
      isUnlimited: false,
      allowedDaysPerYear: 15,
      id: 1,
    },
    {
      title: "Sick Leave",
      isUnlimited: false,
      allowedDaysPerYear: 15,
      id: 2,
    },
    {
      title: "Remote Work",
      isUnlimited: true,
      id: 3,
    },
  ])
  .onConflictDoNothing()
  .run();

// Insert a holiday
const nextTenDays = new Date();
nextTenDays.setDate(nextTenDays.getDate() + 10); // a date 10 days from now

db.insert(holidays)
  .values([
    {
      name: "Thor's Day",
      date: nextTenDays,
    },
  ])
  .onConflictDoNothing()
  .run();
