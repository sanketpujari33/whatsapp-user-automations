import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [PaginationProvider, usePaginationContext] = createSafeContext(
    'Pagination component was not found in tree'
);
