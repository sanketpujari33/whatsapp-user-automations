import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [BreakpointsContext, useBreakpointsContext] = createSafeContext(
    "useBreakpointsContext must be used within BreakpointsContext"
);
