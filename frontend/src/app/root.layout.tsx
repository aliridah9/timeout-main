import { Outlet } from "@tanstack/react-router";
import Main from "~/app/main";

export default function RootLayout() {
  return (
    <Main>
      <Outlet />
    </Main>
  );
}
