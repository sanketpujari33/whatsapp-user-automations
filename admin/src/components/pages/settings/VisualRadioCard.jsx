import { forwardRef } from "react";
import clsx from "clsx";

const modeOptions = [
  {
    value: "light",
    label: "Light Mode",
    icon: (
      <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    bg: "bg-white",
    border: "border-gray-200",
  },
  {
    value: "dark",
    label: "Dark Mode",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    bg: "bg-gray-900",
    border: "border-gray-700",
  },
  {
    value: "system",
    label: "System Sync",
    icon: (
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    bg: "bg-white",
    border: "border-gray-200",
  },
];

export const VisualRadioCard = forwardRef(
  ({ name, value, onChange, className, ...props }, ref) => {
    return (
      <div className="grid grid-cols-3 gap-4" role="radiogroup" {...props}>
        {modeOptions.map((option) => (
          <label
            key={option.value}
            className="cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="hidden peer"
            />
            <div
              className={clsx(
                "border-2 rounded-lg p-2 transition-all",
                value === option.value
                  ? "border-purple-700 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-dark-500",
                "group-hover:border-purple-400 dark:group-hover:border-purple-600"
              )}
            >
              <div
                className={clsx(
                  "rounded border h-24 mb-2 flex items-center justify-center",
                  option.bg,
                  option.border
                )}
              >
                {option.icon}
              </div>
              <p className="text-center text-sm font-medium text-gray-800 dark:text-dark-100">
                {option.label}
              </p>
            </div>
          </label>
        ))}
      </div>
    );
  }
);

VisualRadioCard.displayName = "VisualRadioCard";