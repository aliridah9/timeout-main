import { Link, LinkPropsOptions } from "@tanstack/react-router";
import { FC } from "react";
import Auth from "~/app/auth";
import ProfileHeader from "~/app/profile-header";
import logo from "~/assets/logo.svg";

type Props = {
  children: React.ReactNode;
};

export default function Main({ children }: Props) {
  return (
    <Auth>
      <div className="flex h-full flex-col bg-gray-light lg:flex-row">
        <div className="flex flex-row items-center bg-white lg:flex-col lg:items-stretch">
          <div
            className="
            flex
            h-[70px]
            w-[86px]
            items-center
            justify-center
            lg:h-[200px]
            lg:w-[200px]
         "
          >
            <img className="h-[37px] w-[43px] lg:h-[73px] lg:w-[86px]" src={logo} alt="Logo" />
          </div>
          <nav className="flex lg:flex-col">
            <StyledLink to="/">Dashboard</StyledLink>
            <StyledLink to="/requests">Requests</StyledLink>
            <StyledLink to="/timesheet">Timesheet</StyledLink>
            <StyledLink to="/puzzles">Puzzles</StyledLink>
          </nav>
          <div className="absolute right-[10px] top-[15px] lg:right-14">
            <ProfileHeader />
          </div>
        </div>
        <div className="relative flex-1">{children}</div>
      </div>
    </Auth>
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
        lg:ml-6
        lg:mr-0
        lg:h-14
        lg:rounded-l-full
        lg:p-6
        lg:transition-[background-color]
        lg:duration-300
      "
      inactiveProps={{
        className: "bg-white",
      }}
      activeProps={{
        className: "border-b-blue border-b-2 lg:border-b-0 lg:bg-gray-light text-blue",
      }}
      {...props}
    >
      {children}
    </Link>
  );
};
