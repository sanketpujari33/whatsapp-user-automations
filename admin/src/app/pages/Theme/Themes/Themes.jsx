import { useThemeContext } from "app/contexts/theme/context";
import withRouteGuard from "middleware/withRouteGuard";
import { toast } from "sonner";
import { Card } from "components/ui";
import { Button } from "components/ui";
import { Switch } from "components/ui/Form";
import { ThemeCardGrid, LivePreview } from "components/pages/settings";

function ThemesComponent() {
    const {
        primaryColorScheme,
        darkColorScheme,
        isMonochrome,
        setPrimaryColorScheme,
        setDarkColorScheme,
        setMonochromeMode,
        resetTheme,
    } = useThemeContext();

    const currentThemeId = primaryColorScheme?.name || "purple";

    const handleThemeChange = (themeId) => {
        setPrimaryColorScheme(themeId);
        const darkMap = {
            purple: "cinder",
            indigo: "navy",
            blue: "mirage",
            green: "mint",
            amber: "black",
            red: "black",
            rose: "cinder",
        };
        setDarkColorScheme(darkMap[themeId] || "cinder");
        toast.success("Theme applied");
    };

    const handleReset = () => {
        resetTheme();
        toast.success("Themes reset to defaults");
    };

    return (
        <div className="my-5 flex flex-col gap-5">
            <Card className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Themes & Branding</h1>
                        <p className="mt-1 text-sm text-gray-500">Customize the visual identity of your administrative dashboard.</p>
                    </div>
                    <Button variant="outlined" onClick={handleReset}>Reset to Defaults</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100">System Themes</h2>
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">8 Themes Available</span>
                        </div>
                        <ThemeCardGrid
                            activeTheme={currentThemeId}
                            onThemeChange={handleThemeChange}
                        />
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100 mb-6">Customization Controls</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-dark-100">Custom Accent Color</p>
                                    <p className="text-sm text-gray-500">Override the primary theme color for buttons and links.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary" />
                                    <input
                                        className="w-24 px-3 py-1.5 border border-gray-200 dark:border-dark-500 rounded text-xs font-mono uppercase"
                                        type="text"
                                        value={`#${primaryColorScheme?.["500"]?.toString(16).toUpperCase() || "2A0845"}`}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="h-px bg-gray-200 dark:bg-dark-500" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-dark-100">High Contrast Mode</p>
                                    <p className="text-sm text-gray-500">Enhances readability by increasing color variance.</p>
                                </div>
                                <Switch
                                    color="primary"
                                    checked={isMonochrome}
                                    onChange={(e) => {
                                        setMonochromeMode(e.target.checked);
                                        toast.success(e.target.checked ? "High contrast enabled" : "High contrast disabled");
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <LivePreview />
                    <Card className="p-4 mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-purple-700 dark:text-purple-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                                All themes are WCAG 2.1 AA compliant by default, ensuring accessibility.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default withRouteGuard(ThemesComponent, "theme/themes");
