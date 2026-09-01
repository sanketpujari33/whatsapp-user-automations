import { Navigate, useOutlet } from "react-router";
import { useSelector } from "react-redux";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

export default function GhostGuard() {
  const outlet = useOutlet();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const url = `${new URLSearchParams(window.location.search).get(
    REDIRECT_URL_KEY,
  )}`;

  if (isAuthenticated) {
    if (url && url !== "") {
      return <Navigate to={url} />;
    }
    return <Navigate to={HOME_PATH} />;
  }

  return <>{outlet}</>;
}
