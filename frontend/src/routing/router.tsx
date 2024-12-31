import { Router, Route, RootRoute, Navigate } from "@tanstack/react-router";
import RootLayout from "~/app/root.layout";
import IndexPage from "~/app/route-index/index.page";
import RequestsPage from "~/app/route-requests/requests.page";
import TimeSheetPage from "~/app/route-timesheet/time-sheet.page";
import PuzzlesLayout from "~/app/route-puzzles/puzzles.layout";
// @ts-expect-error "This module is a jsx file so doesn't have a type"
import SpeakPage from "~/app/route-puzzles/route-speak/speak.page";
import ClockPage from "~/app/route-puzzles/route-clock/clock.page";

// Create a root route
const root = new RootRoute({
  component: RootLayout,
});

const indexRoute = new Route({
  getParentRoute: () => root,
  path: "/",
  component: IndexPage,
});

const requestsRoute = new Route({
  getParentRoute: () => root,
  path: "/requests",
  component: RequestsPage,
});

const timeSheetRoute = new Route({
  getParentRoute: () => root,
  path: "/timesheet",
  component: TimeSheetPage,
});

const puzzlesRoute = new Route({
  getParentRoute: () => root,
  path: "/puzzles",
  component: PuzzlesLayout,
});

const puzzlesSpeakRoute = new Route({
  getParentRoute: () => puzzlesRoute,
  path: "speak",
  component: SpeakPage,
});

const puzzlesClockRoute = new Route({
  getParentRoute: () => puzzlesRoute,
  path: "clock",
  component: ClockPage,
});

const puzzlesIndexRoute = new Route({
  getParentRoute: () => puzzlesRoute,
  path: "/",
  component: () => <Navigate to="/puzzles/clock" />,
});

const routeTree = root.addChildren([
  indexRoute,
  requestsRoute,
  timeSheetRoute,
  puzzlesRoute.addChildren([puzzlesIndexRoute, puzzlesSpeakRoute, puzzlesClockRoute]),
]);

// Set up a Router instance
const router = new Router({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
