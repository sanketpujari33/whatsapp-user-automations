import { useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { TeamTypeContext } from "./context";
import { fetchTeamTypeStatus } from "store/slices/teamTypeSlice";
import { TOKEN_KEY } from "constants/app.constant";

export function TeamTypeProvider({ children }) {
  const dispatch = useDispatch();
  const { isTeamTypeEnabled, isLoading, error } = useSelector((state) => state.teamType);

  const fetchStatus = useCallback(() => {
    dispatch(fetchTeamTypeStatus());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchStatus();
    }
  }, [fetchStatus]);

  const contextValue = useMemo(() => ({
    isTeamTypeEnabled,
    loading: isLoading,
    error,
    fetchTeamTypeStatus: fetchStatus,
  }), [isTeamTypeEnabled, isLoading, error, fetchStatus]);

  return (
    <TeamTypeContext.Provider value={contextValue}>
      {children}
    </TeamTypeContext.Provider>
  );
}

TeamTypeProvider.propTypes = {
  children: PropTypes.node,
};
