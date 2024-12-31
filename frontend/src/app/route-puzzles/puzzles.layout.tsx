import { Link, LinkPropsOptions, Outlet } from "@tanstack/react-router";
import { FC } from "react";

export default function PuzzlesLayout() {
  return (
    <div className="flex h-full flex-col bg-gray-light">
      <div className="flex h-[70px] flex-row items-center bg-white">
        <nav className="flex">
          <StyledLink to="/puzzles/clock">Clock Puzzle</StyledLink>
          <StyledLink to="/puzzles/speak">Speak Puzzle</StyledLink>
        </nav>
      </div>
      <div className="relative flex-1">
        <Outlet />
      </div>
    </div>
  );
}

const StyledLink: FC<React.PropsWithChildren<LinkPropsOptions>> = ({ children, ...props }) => {
  return (
    <Link
      className="
        ml-6
        mr-3
        flex
        items-center
        p-2
        text-sm
        hover:text-blue
      "
      inactiveProps={{
        className: "bg-white",
      }}
      activeProps={{
        className: "border-b-blue border-b-2 text-blue",
      }}
      {...props}
    >
      {children}
    </Link>
  );
};
