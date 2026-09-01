import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [LocaleContext, useLocaleContext] = createSafeContext(
    "useLocaleContext must be used within LocaleProvider",
);
