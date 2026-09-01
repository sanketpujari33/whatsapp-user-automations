import { colors } from "constants/colors.constant";

const DEFAULT_DARK_COLOR = "cinder";
// Options: "cinder", "navy", "mirage", "black", "mint"  

const DEFAULT_LIGHT_COLOR = "slate";
// Options: "slate", "gray", "neutral"  

const DEFAULT_PRIMARY_COLOR = "purple";
// Options: "indigo", "blue", "green", "amber", "purple", "rose", "teal", "cyan", "fuchsia", "pink", "orange", "yellow", "lime", "emerald", "violet", "zinc", "stone", "sky"  

// Default theme configuration  
export const defaultTheme = {
    themeMode: "system",
    // Options: "light", "dark", "system"  
    isMonochrome: false,
    // If true, the theme uses a monochrome color palette  

    themeLayout: "sideblock",
    // Options: "main-layout", "sideblock"  
    cardSkin: "bordered",
    // Options: "bordered", "shadow-sm"  

    // Dark mode color scheme  
    darkColorScheme: {
        name: DEFAULT_DARK_COLOR,
        ...colors[DEFAULT_DARK_COLOR],
    },

    // Light mode color scheme  
    lightColorScheme: {
        name: DEFAULT_LIGHT_COLOR,
        ...colors[DEFAULT_LIGHT_COLOR],
    },

    // Primary color scheme  
    primaryColorScheme: {
        name: DEFAULT_PRIMARY_COLOR,
        ...colors[DEFAULT_PRIMARY_COLOR],
    },

    // Language settings  
    defaultLang: "en",
    fallbackLang: "en",

    // Notification settings  
    notification: {
        isExpanded: false,
        position: "top-center",
        visibleToasts: 4,
    },

    // Font settings
    headingFont: "Hanken Grotesk",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    baseFontSize: 16,
    headingWeight: "700",
    letterSpacing: -0.02,
    lineHeightMode: "standard",
    adaptiveScaling: true,
    subpixelSmoothing: true,

    // Dimensions
    sidebarWidth: 280,
    headerHeight: 64,
    
    // Shape styling
    borderRadius: "rounded-lg", // "rounded-none", "rounded-sm", "rounded-md", "rounded-lg", "rounded-full"
    
    // Animations
    animations: {
        enabled: true,
        speed: "normal", // "fast", "normal", "slow"
    }
};
