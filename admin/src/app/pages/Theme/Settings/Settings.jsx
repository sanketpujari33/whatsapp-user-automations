/* eslint-disable react-refresh/only-export-components */
import withRouteGuard from "middleware/withRouteGuard";

function Settings() {
    return <div>Settings</div>;
}

export default withRouteGuard(Settings, "theme/theme-settings");
