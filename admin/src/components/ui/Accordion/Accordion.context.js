import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [AccordionContextProvider, useAccordionContext] = createSafeContext(
    "useAccordionContext must be used within AccordionProvider"
);
