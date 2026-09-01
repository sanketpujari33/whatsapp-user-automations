import clsx from "clsx";
import { colors } from "constants/colors.constant";

const makeThemeGradient = (palette) =>
  `linear-gradient(180deg, ${palette?.["700"] || "#2A0845"} 0%, ${palette?.["500"] || "#6441A5"} 100%)`;

const presetThemes = [
  { id: "purple", name: "Royal Amethyst", subtitle: "Default System Theme", palette: colors.purple },
  { id: "indigo", name: "Deep Indigo", subtitle: "Professional Dark Core", palette: colors.indigo },
  { id: "blue", name: "Ocean Blue", subtitle: "Calm & Focused", palette: colors.blue },
  { id: "green", name: "Evergreen", subtitle: "Eco-friendly aesthetics", palette: colors.green },
  { id: "amber", name: "Golden Hour", subtitle: "Warm & Inviting", palette: colors.amber },
  { id: "red", name: "Crimson Peak", subtitle: "High-alert monitoring", palette: colors.red },
  { id: "rose", name: "Blush Rose", subtitle: "Soft & Elegant", palette: colors.rose },
  { id: "teal", name: "Teal Tide", subtitle: "Modern & Fresh", palette: colors.teal },
];

export function ThemeCard({ id, name, subtitle, palette, isActive, onClick }) {
  const headerColor = palette?.["600"] || "#472575";
  const gradient = makeThemeGradient(palette);
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group relative text-left p-1 rounded-xl bg-white dark:bg-dark-800 overflow-hidden transition-all",
        isActive
          ? "border-2 border-primary ring-2 ring-primary ring-offset-4 dark:ring-offset-dark-900"
          : "border border-gray-200 dark:border-dark-500 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg"
      )}
    >
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700 relative">
        <div className="absolute inset-0 flex flex-col">
          <div className="h-4" style={{ backgroundColor: headerColor }} />
          <div className="flex-1 flex">
            <div className="w-8" style={{ background: gradient }} />
            <div className="flex-1 p-2 space-y-1">
              <div className="w-3/4 h-2 bg-gray-300 dark:bg-dark-400 rounded" />
              <div className="w-1/2 h-2 bg-gray-200 dark:bg-dark-500 rounded" />
            </div>
          </div>
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {!isActive && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
            <span className="px-4 py-1.5 bg-white dark:bg-dark-700 shadow-md rounded-full text-xs font-medium text-gray-800 dark:text-dark-100">Preview</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <span className={clsx("block text-sm font-semibold", isActive ? "text-primary" : "text-gray-800 dark:text-dark-100")}>{name}</span>
        <span className="block text-xs text-gray-500 dark:text-dark-300 mt-0.5">{subtitle}</span>
      </div>
    </button>
  );
}

export function ThemeCardGrid({ activeTheme, onThemeChange, className }) {
  return (
    <div className={clsx("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {presetThemes.map((theme) => (
        <ThemeCard key={theme.id} {...theme} isActive={activeTheme === theme.id} onClick={() => onThemeChange(theme.id)} />
      ))}
    </div>
  );
}
