// Import Dependencies
import clsx from "clsx";
import { Link } from "react-router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Local Imports
import SearchIcon from "assets/dualicons/search.svg?react";
import adminLogo from "assets/logo/AdminLogo.png";
import { SidebarToggleBtn } from "components/shared";
import { Profile } from "../Profile";
import { useThemeContext } from "app/contexts/theme/context";
import { useAuthContext } from "app/contexts/auth/context";
import { routes } from "constants/routeconstants";
import { Notifications } from "components/template";
import { Button } from "components/ui";
import { RightSidebar } from "components/template";
import { LanguageSelector } from "components/template";
import { Search } from "components/template";

// ----------------------------------------------------------------------

function SlashIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="20"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        d="M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z"
        opacity="0.4"
      />
      <path fill="currentColor" d="M11.8 6L8 15.1h-.9L10.8 6h1z" />
    </svg>
  );
}

export function Header({ config, isSidebar }) {
  const { adminData } = useAuthContext();
  const { cardSkin } = useThemeContext();

  const showNavLinks = config?.showNavLinks ?? false;
  const showProfile = config?.showProfile ?? false;
  const borderBottom = config?.borderBottom ?? false;

  const navLinks = [
    { label: "Dashboard", path: routes.dashboard || "/" },
    { label: "Users", path: routes.customers || "/users" },
    { label: "Settings", path: routes.settings || "/settings" },
  ];

  if (isSidebar) {
    return (
      <header
        className={clsx(
          "sticky top-0 z-20 flex h-[65px] shrink-0 items-center justify-between border-b border-white/10 px-6",
          cardSkin === "shadow-sm" ? "" : "",
        )}
      >
        <div className="flex items-center pt-1.5">
          <Link to="/">
            <img src={adminLogo} className="h-8 w-auto" alt="Admin" />
          </Link>
        </div>
        <div className="xl:hidden">
          <SidebarToggleBtn />
        </div>
      </header>
    );
  }

  return (
    <header
      style={{
        borderBottom: borderBottom ? "1px solid gray" : undefined,
      }}
      className={clsx(
        "app-header transition-content sticky top-0 z-20 flex h-[65px] shrink-0 items-center justify-between border-b border-white/10 my-brand-bg px-(--margin-x) backdrop-blur-sm backdrop-saturate-150 dark:border-dark-600",
        cardSkin === "shadow-sm" ? "" : "",
      )}
    >
      <div className="xl:hidden">
        <SidebarToggleBtn />
      </div>

      {showNavLinks && adminData?.role === "0" && (
        <nav className="ml-4 hidden gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="truncate font-medium text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className={clsx("flex items-center gap-2 ltr:-mr-1.5 rtl:-ml-1.5", showNavLinks && "justify-end sm:flex-1")}>
        <Search
          renderButton={(open) => (
            <>
              <Button
                onClick={open}
                unstyled
                className="h-8 w-64 justify-between gap-2 rounded-full border border-white/20 px-3 text-xs-plus hover:border-white/40 dark:border-dark-500 dark:hover:border-dark-400 max-sm:hidden text-white"
              >
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="size-4 text-white" />
                  <span className="text-white/60 dark:text-dark-300">
                    Search here...
                  </span>
                </div>
                <SlashIcon className="size-5 text-white/50 shrink-0" />
              </Button>

              <Button
                onClick={open}
                variant="flat"
                isIcon
                className="relative size-9 rounded-full sm:hidden"
              >
                <SearchIcon className="size-6 text-white dark:text-dark-100" />
              </Button>
            </>
          )}
        />
        <Notifications />
        <RightSidebar />
        <LanguageSelector />
        {showProfile && <Profile />}
      </div>
    </header>
  );
}
