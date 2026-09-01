import { useThemeContext } from "app/contexts/theme/context";
import withRouteGuard from "middleware/withRouteGuard";
import { toast } from "sonner";
import clsx from "clsx";
import { Card, Button } from "components/ui";
import { Switch, Range } from "components/ui/Form";
import { FontSpecimen } from "components/pages/settings";

const headingFontOptions = ["Hanken Grotesk", "Inter", "System Sans Serif", "JetBrains Mono"];
const bodyFontOptions = ["Inter", "Hanken Grotesk", "Roboto", "Georgia"];
const weightOptions = [
    { value: "400", label: "Regular" },
    { value: "600", label: "Semibold" },
    { value: "700", label: "Bold" },
];
const lineHeightOptions = [
    { value: "tight", label: "Tight" },
    { value: "standard", label: "Standard" },
    { value: "loose", label: "Loose" },
];

function FontsComponent() {
    const {
        headingFont,
        bodyFont,
        monoFont,
        baseFontSize,
        headingWeight,
        letterSpacing,
        lineHeightMode,
        adaptiveScaling,
        subpixelSmoothing,
        setHeadingFont,
        setBodyFont,
        setMonoFont,
        setBaseFontSize,
        setHeadingWeight,
        setLetterSpacing,
        setLineHeightMode,
        setAdaptiveScaling,
        setSubpixelSmoothing,
        resetTheme,
    } = useThemeContext();

    const handleReset = () => {
        resetTheme();
        toast.success("Font settings reset to defaults");
    };

    const changeFontSize = (delta) => {
        const newSize = Math.min(20, Math.max(14, baseFontSize + delta));
        setBaseFontSize(newSize);
    };

    return (
        <div className="my-5 flex flex-col gap-5">
            <Card className="p-5">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <span>Settings</span>
                            <span>/</span>
                            <span className="text-purple-700 dark:text-purple-300 font-semibold">Fonts</span>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Typography Configuration</h1>
                        <p className="mt-1 text-sm text-gray-500 max-w-2xl">
                            Define the typographic rhythm of your application. These settings will globally update headings, body text, and UI labels.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outlined" onClick={handleReset}>Reset to Defaults</Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100">Heading Typography</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Font Family</label>
                                <div className="relative">
                                    <select
                                        value={headingFont}
                                        onChange={(e) => setHeadingFont(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 rounded-lg px-4 py-3 text-base appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 dark:text-dark-100"
                                        style={{ fontFamily: headingFont }}
                                    >
                                        {headingFontOptions.map((font) => (
                                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                        ))}
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Default Weight</label>
                                <div className="flex gap-2">
                                    {weightOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setHeadingWeight(opt.value)}
                                            className={clsx(
                                                "flex-1 py-2 rounded-md border text-sm transition-colors",
                                                headingWeight === opt.value
                                                    ? "border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 font-bold"
                                                    : "border-gray-200 dark:border-dark-500 hover:border-purple-300 dark:hover:border-purple-700 text-gray-600 dark:text-dark-300"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Letter Spacing ({letterSpacing}em)
                                </label>
                                <Range
                                    color="primary"
                                    min={-5}
                                    max={5}
                                    value={Math.round(letterSpacing * 100)}
                                    onChange={(e) => setLetterSpacing(e.target.value / 100)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-500">
                                <div>
                                    <p className="font-medium text-sm text-gray-800 dark:text-dark-100">Adaptive Scaling</p>
                                    <p className="text-xs text-gray-500">Automatically resize for mobile</p>
                                </div>
                                <Switch
                                    color="primary"
                                    checked={adaptiveScaling}
                                    onChange={(e) => setAdaptiveScaling(e.target.checked)}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h12m-9 4h6m-3 4h6" />
                            </svg>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100">Body Typography</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Font Family</label>
                                <div className="relative">
                                    <select
                                        value={bodyFont}
                                        onChange={(e) => setBodyFont(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 rounded-lg px-4 py-3 text-base appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 dark:text-dark-100"
                                        style={{ fontFamily: bodyFont }}
                                    >
                                        {bodyFontOptions.map((font) => (
                                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                        ))}
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Base Size ({baseFontSize}px)</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => changeFontSize(-1)}
                                        className="p-2 rounded-md bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 text-purple-700"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="font-bold text-lg w-12 text-center text-gray-800 dark:text-dark-100">{baseFontSize}px</span>
                                    <button
                                        type="button"
                                        onClick={() => changeFontSize(1)}
                                        className="p-2 rounded-md bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 text-purple-700"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Line Height</label>
                                <div className="flex gap-2">
                                    {lineHeightOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setLineHeightMode(opt.value)}
                                            className={clsx(
                                                "flex-1 py-2 rounded-md border text-sm transition-colors",
                                                lineHeightMode === opt.value
                                                    ? "border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300"
                                                    : "border-gray-200 dark:border-dark-500 hover:border-purple-300 dark:hover:border-purple-700 text-gray-600 dark:text-dark-300"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-500">
                                <div>
                                    <p className="font-medium text-sm text-gray-800 dark:text-dark-100">Subpixel Smoothing</p>
                                    <p className="text-xs text-gray-500">Enhance text clarity on LCDs</p>
                                </div>
                                <Switch
                                    color="primary"
                                    checked={subpixelSmoothing}
                                    onChange={(e) => setSubpixelSmoothing(e.target.checked)}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100">Data & Code</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Used for table data, labels, and technical elements.</p>
                            <div className="bg-gray-900 dark:bg-black text-white p-4 rounded-lg text-xs font-mono overflow-x-auto">
                                <code>
                                    <span className="text-purple-400">const</span>{" "}
                                    <span className="text-amber-300">brandConfig</span> = {"{"}
                                    <br />
                                    &nbsp;&nbsp;fontFamily:{" "}
                                    <span className="text-green-400">{`"${monoFont}"`}</span>,
                                    <br />
                                    &nbsp;&nbsp;baseSize:{" "}
                                    <span className="text-green-400">{baseFontSize}</span>
                                    <br />
                                    {"}"};
                                </code>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mono Font</label>
                                <div className="relative">
                                    <select
                                        value={monoFont}
                                        onChange={(e) => setMonoFont(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 rounded-lg px-4 py-3 text-base appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 dark:text-dark-100"
                                        style={{ fontFamily: monoFont }}
                                    >
                                        {["JetBrains Mono", "Fira Code", "Source Code Pro"].map((font) => (
                                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                        ))}
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-500 rounded-xl overflow-hidden shadow-sm sticky top-24">
                        <div className="bg-[var(--color-primary-700)] p-4 flex justify-between items-center">
                            <h4 className="text-white font-bold text-sm">Live Preview</h4>
                            <div className="flex gap-2">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-6 max-h-[600px] overflow-y-auto">
                            <FontSpecimen
                                headingFont={headingFont}
                                bodyFont={bodyFont}
                                headingWeight={headingWeight}
                            />
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-500">
                            <p className="text-xs text-gray-500 text-center">
                                Changes are applied instantly.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 flex gap-3">
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-sm text-amber-800 dark:text-amber-200 mb-1">Design Tip</p>
                            <p className="text-xs text-amber-700 dark:text-amber-300 opacity-90">
                                Avoid using more than two font families. Stick to a sans-serif for headings and a highly legible font for body copy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouteGuard(FontsComponent, "theme/fonts");
