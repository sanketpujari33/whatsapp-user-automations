// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router";
import clsx from "clsx";

// Local Imports
import { ASSETS } from "constants/assets.constants";
import { Menu } from "./Menu";
import { Item } from "./Menu/Item";
import { Profile } from "../../Profile";
import { useThemeContext } from "app/contexts/theme/context";
import { settings } from "app/navigation/settings";
import { routes } from "constants/routeconstants";

// ----------------------------------------------------------------------

export function MainPanel({ nav, setActiveSegment, activeSegment }) {
  const { cardSkin } = useThemeContext();
  return (
    <div className="main-panel">
      <div
        className={clsx(
          "flex h-full w-full flex-col items-center border-gray-150 ltr:border-r rtl:border-l my-brand-bg",
          cardSkin === "shadow-sm" ? "dark:border-dark-600/80" : "",
        )}
      >
        {/* Application Logo */}
        <div className="flex pt-3.5">
          <Link to="/">
            <img src={ASSETS.logo.admin} className="h-8 w-auto" alt="Admin" />
          </Link>
        </div>

        <Menu
          nav={nav}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
        />

        {/* Bottom Links */}
        <div className="flex flex-col items-center space-y-3 py-2.5">
          <Item
            id={settings.id}
            component={Link}
            to={`/${routes.settings}`}
            title={"Settings"}
            isActive={activeSegment === settings.path}
            Icon={settings.Icon}
          />
          <Profile />
        </div>
      </div>
    </div>
  );
}

MainPanel.propTypes = {
  nav: PropTypes.array,
  setActiveSegment: PropTypes.func,
  activeSegment: PropTypes.string,
};
