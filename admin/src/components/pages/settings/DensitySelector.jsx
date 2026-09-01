import clsx from "clsx";

const densityOptions = [
  {
    value: "compact",
    label: "Compact",
    description: "Maximize data visibility with tighter spacing.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Standard spacing for everyday administrative tasks.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    value: "relaxed",
    label: "Relaxed",
    description: "Ample white space for a focused, clear experience.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    ),
  },
];

export function DensitySelector({ value, onChange, className }) {
  return (
    <div className={clsx("space-y-4", className)}>
      {densityOptions.map((option) => (
        <label
          key={option.value}
          className={clsx(
            "flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer group",
            value === option.value
              ? "border-2 border-primary bg-primary/5 dark:bg-primary/10"
              : "border border-gray-200 dark:border-dark-500 hover:border-primary dark:hover:border-primary"
          )}
        >
          <div className="flex items-center gap-4">
            <span className={clsx(
              "shrink-0",
              value === option.value ? "text-primary" : "text-gray-400 dark:text-dark-300"
            )}>
              {option.icon}
            </span>
            <div>
              <p className={clsx(
                "font-medium text-sm",
                value === option.value ? "text-primary" : "text-gray-800 dark:text-dark-100"
              )}>
                {option.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-300 mt-0.5">{option.description}</p>
            </div>
          </div>
          <input
            type="radio"
            name="density"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-primary focus:ring-primary"
          />
        </label>
      ))}
    </div>
  );
}
