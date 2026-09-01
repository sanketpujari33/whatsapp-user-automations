import { useThemeContext } from "app/contexts/theme/context";
import withRouteGuard from "middleware/withRouteGuard";
import { toast } from "sonner";
import { Card, Button } from "components/ui";
import { VisualRadioCard, ColorSwatchGrid, DensitySelector, LivePreview } from "components/pages/settings";

function AppearanceComponent() {
    const {
        themeMode,
        lightColorScheme,
        darkColorScheme,
        primaryColorScheme,
        cardSkin,
        setThemeMode,
        setPrimaryColorScheme,
        setCardSkin,
        resetTheme,
    } = useThemeContext();

    const handlePrimaryColorChange = (val) => {
        setPrimaryColorScheme(val);
        toast.success("Primary color updated");
    };

    const handleReset = () => {
        resetTheme();
        toast.success("Appearance reset to defaults");
    };

    return (
        <div className="my-5 flex flex-col gap-5">
            <Card className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Appearance</h1>
                        <p className="mt-1 text-sm text-gray-500">Customize the visual experience of your administration workspace.</p>
                    </div>
                    <Button color="primary" onClick={handleReset}>Reset to Defaults</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100 mb-4">Visual Mode</h2>
                        <VisualRadioCard
                            name="themeMode"
                            value={themeMode}
                            onChange={(e) => setThemeMode(e.target.value)}
                        />
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100">Accent Color</h2>
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">Customizable</span>
                        </div>
                        <ColorSwatchGrid
                            value={primaryColorScheme?.name || "purple"}
                            onChange={handlePrimaryColorChange}
                        />
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100 mb-4">Interface Density</h2>
                        <DensitySelector
                            value={cardSkin === "bordered" ? "balanced" : cardSkin === "shadow-sm" ? "relaxed" : "compact"}
                            onChange={(val) => {
                                const skin = val === "compact" ? "none" : val === "relaxed" ? "shadow-sm" : "bordered";
                                setCardSkin(skin);
                                toast.success(`Density set to ${val}`);
                            }}
                        />
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <LivePreview />
                </div>
            </div>
        </div>
    );
}

export default withRouteGuard(AppearanceComponent, "theme/appearance");
