import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [ThemeContext, useThemeContext] = createSafeContext(
    "useThemeContext must be used within ThemeProvider",
);
