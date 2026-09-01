import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const normalizeRouteKey = (value) =>
  `${value || ""}`.trim().replace(/^\/+/, "").toLowerCase();

const routeNameToLabel = (value) =>
  normalizeRouteKey(value)
    .split("/")
    .pop()
    ?.replace(/-/g, " ");

const routeNameCandidates = (value) => {
  const normalized = normalizeRouteKey(value);
  const parts = normalized.split("/").filter(Boolean);
  const candidates = new Set([normalized]);
  for (let length = parts.length - 1; length > 0; length -= 1) {
    candidates.add(parts.slice(0, length).join("/"));
  }
  return candidates;
};

const withRouteGuard = (WrappedComponent, routeName) => {
  const GuardedComponent = (props) => {
    const navigate = useNavigate();

    const allowPages = useSelector((state) => state.auth.allowPages);
    const normalizedRouteName = normalizeRouteKey(routeName);
    const normalizedRouteCandidates = routeNameCandidates(routeName);
    const routeLabel = routeNameToLabel(routeName);
    const currentPermission = allowPages?.find(
      (route) => {
        const candidates = [route.id, route.path, route.name].map(normalizeRouteKey);
        return (
          candidates.includes(normalizedRouteName) ||
          candidates.some((candidate) => normalizedRouteCandidates.has(candidate)) ||
          (routeLabel && candidates.includes(routeLabel))
        );
      },
    );

    useEffect(() => {
      const isAllowed =
        currentPermission?.access && (currentPermission.actions?.view ?? true);

      if (allowPages && allowPages.length > 0 && !isAllowed) {
        navigate("/404", { replace: true });
      }

    }, [navigate, allowPages, currentPermission]);

    return (
      <WrappedComponent
        {...props}
        pagePermission={currentPermission}
        permissions={currentPermission}
      />
    );
  };
  return GuardedComponent;
};

export default withRouteGuard;
