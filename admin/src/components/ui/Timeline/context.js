import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [TimelineContext, useTimelineContext] = createSafeContext(
    "useTimelineContext must be used within TimelineProvider"
);
