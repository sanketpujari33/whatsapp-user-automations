import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [AuthContext, useAuthContext] = createSafeContext(
    "useAuthContext must be used within AuthProvider"
);
