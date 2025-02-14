import { useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import { addDays, format, startOfDay } from "date-fns";
import SunIcon from "~/app/icon-sun.svg";
import SickIcon from "~/app/icon-sick.svg";
import HouseIcon from "~/app/icon-house.svg";
import SearchIcon from "~/app/icon-search.svg";
import RefreshIcon from "~/app/icon-refresh.svg";
import LeftArrowIcon from "./icon-arrow-left.svg";
import RightArrowIcon from "./icon-arrow-right.svg";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../backend/src/router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/table";

export default function TimeSheetPage() {
  const today = startOfDay(new Date());
  const [{ startDate, endDate }, setDateInterval] = useState({
    startDate: today,
    endDate: addDays(today, 6),
  });

  const timesheetQuery = trpc.employees.getTimeSheet.useQuery({
    startDate,
    endDate,
  });

  const holidaysQuery = trpc.holidays.getHolidaysInRange.useQuery({
    startDate,
    endDate,
  });

  const currentUserQuery = trpc.employees.getCurrentEmployee.useQuery();
  const currentUserId = currentUserQuery.data?.details?.id;

  const data = timesheetQuery.data;
  const holidays = holidaysQuery.data || [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    const search = searchTerm.toLowerCase();
    return data.filter((record) => {
      const fullName = `${record.employee.firstName} ${record.employee.lastName}`.toLowerCase();
      return fullName.includes(search);
    });
  }, [data, searchTerm]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-start px-6">
        <h1 className="mr-6 text-3xl font-bold text-black-dark">Timesheet</h1>
        <div className="flex h-10 w-[473px] items-center rounded-3xl bg-white">
          <div
            className="ml-4 mr-[10px] h-[14px] w-[14px] bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url(${SearchIcon})`,
            }}
          ></div>
          <input
            className="w-full rounded-3xl outline-none"
            placeholder="Search for an employee"
            data-testid="search-timesheet-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex h-14 items-end justify-end px-6">
        <div className="mr-3 flex h-10 w-[166px] items-center rounded-[8px] bg-white">
          <button
            onClick={() =>
              setDateInterval((prev) => ({
                startDate: addDays(prev.startDate, -7),
                endDate: addDays(prev.endDate, -7),
              }))
            }
            type="button"
            className="ml-[11px] h-[8px] w-[12px] bg-contain bg-no-repeat active:opacity-50"
            style={{
              backgroundImage: `url(${LeftArrowIcon})`,
            }}
            data-testid="timesheet-button-previous-week"
          ></button>
          <div className="flex flex-1 justify-center text-blue">
            {format(startDate, "dd MMM")}-{format(endDate, "dd MMM")}
          </div>
          <button
            onClick={() =>
              setDateInterval((prev) => ({
                startDate: addDays(prev.startDate, 7),
                endDate: addDays(prev.endDate, 7),
              }))
            }
            className="mr-[11px] h-[8px] w-[12px] bg-contain bg-no-repeat active:opacity-50"
            style={{
              backgroundImage: `url(${RightArrowIcon})`,
            }}
            data-testid="timesheet-button-next-week"
          ></button>
        </div>
        <button
          onClick={() => {
            timesheetQuery.remove();
            holidaysQuery.remove();
            timesheetQuery.refetch();
            holidaysQuery.refetch();
          }}
          type="button"
          aria-label="Refresh"
          className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white active:opacity-50"
        >
          <div
            className="h-[14px] w-[14px] bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url(${RefreshIcon})`,
            }}
          ></div>
        </button>
      </div>
      {timesheetQuery.isLoading && <div>Loading...</div>}
      {timesheetQuery.error && <div className="text-red">{timesheetQuery.error.message}</div>}
      {filteredData &&
        (filteredData.length === 0 ? (
          <div data-testid="timesheet-table-no-employees">No employees found!</div>
        ) : (
          timesheetQuery.isSuccess &&
          holidaysQuery.isSuccess && (
            <TimeSheetTable
              startDate={startDate}
              data={filteredData}
              holidays={holidays}
              currentUserId={currentUserId}
            />
          )
        ))}
    </div>
  );
}

function getDatesOfWeek(startDate: Date) {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
}

type RouterOutput = inferRouterOutputs<AppRouter>;
type TimeSheetResponse = Awaited<RouterOutput["employees"]["getTimeSheet"]>;
type EmployeeDate = TimeSheetResponse[number]["dates"][number];

function TimeSheetTable(props: {
  data: TimeSheetResponse;
  startDate: Date;
  holidays: { name: string; date: string }[];
  currentUserId: number | undefined;
}) {
  const { data, startDate, holidays, currentUserId } = props;
  const dates = useMemo(() => getDatesOfWeek(startDate), [startDate]);

  return (
    <div className="min-h-0">
      <div className="h-full p-6">
        <div className="h-full rounded-md border">
          <Table wrapperClassName="h-full overflow-y-auto position-relative" className="h-full">
            <TableHeader>
              <TableRow className="sticky top-0 bg-white shadow">
                <TableHead className="text-blue">EMPLOYEE</TableHead>
                {dates.map((date) => (
                  <TableHead key={date.toString()}>
                    <div className="flex flex-col">
                      <span className="font-bold">{format(date, "dd MMM")}</span>
                      <span>{format(date, "EEE")}</span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-blue">HOLIDAYS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((record) => {
                  const isCurrentUser = Number(record.employee.id) === currentUserId;

                  return (
                    <TableRow
                      key={record.employee.id}
                      className={`bg-white ${isCurrentUser ? "border-y-4 border-blue" : ""}`}
                      data-testid={"timesheet-table-row-" + record.employee.id}
                    >
                      <TableCell
                        className={`font-bold ${isCurrentUser ? "bg-blue text-white" : ""}`}
                        data-testid={"timesheet-row-name-" + record.employee.id}
                      >
                        {record.employee.firstName} {record.employee.lastName}
                        {isCurrentUser && " (You)"}
                      </TableCell>
                      {dates.map((date, i) => (
                        <TableCell
                          key={date.toString()}
                          className={isCurrentUser ? "border-blue" : ""}
                          data-testid={"timesheet-row-cell-" + (i + 1)}
                        >
                          <TimeSheetCell value={record.dates[i]} />
                        </TableCell>
                      ))}
                      <TableCell>
                        {holidays.map((holiday) => (
                          <div key={holiday.date} className="font-bold text-red-500">
                            {holiday.name}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell data-testid="timesheet-table-no-results" colSpan={8} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function TimeSheetCell(props: { value: EmployeeDate }) {
  const { value } = props;

  if (value.type === "holiday") {
    return (
      <div className="font-bold text-red-500" data-testid="timesheet-cell-holiday">
        {value.holidayName}
      </div>
    );
  }

  if (value.isWeekend) {
    return (
      <div className="text-gray-500" data-testid="timesheet-cell-weekend">
        Weekend
      </div>
    );
  }

  const [icon, colorClass, iconClass] =
    value.type === "leave" && value.leavePolicy
      ? {
          "Annual Leave": [SunIcon, "text-purple", "h-[15.4px] w-[15px]"],
          "Sick Leave": [SickIcon, "text-yellow-dark", "h-[14px] w-[14px]"],
          "Remote Work": [HouseIcon, "text-blue", "h-[13px] w-[16px]"],
        }[value.leavePolicy.title] ?? []
      : [];

  return (
    <div className={`flex items-center ${colorClass ?? ""}`} data-testid="timesheet-cell-status">
      {icon && (
        <div
          className={`m-1 ${iconClass} bg-contain bg-no-repeat`}
          style={{
            backgroundImage: `url(${icon})`,
          }}
        ></div>
      )}
      {value.type === "work" && "9 hrs"}
      {value.type === "leave" && value.leavePolicy?.title}
    </div>
  );
}
