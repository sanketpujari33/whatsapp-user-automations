import { Navigate, useLocation, useOutlet } from "react-router";
import { useSelector } from "react-redux";
import { GHOST_ENTRY_PATH, REDIRECT_URL_KEY } from "../constants/app.constant";

export default function AuthGuard() {
  const outlet = useOutlet();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${GHOST_ENTRY_PATH}?${REDIRECT_URL_KEY}=${location.pathname}`}
        replace
      />
    );
  }

  return <>{outlet}</>;
}
