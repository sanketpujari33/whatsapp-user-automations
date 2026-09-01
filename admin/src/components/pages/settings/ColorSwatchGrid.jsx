import clsx from "clsx";

const primaryColorOptions = [
  { name: "purple", color: "#6441A5" },
  { name: "indigo", color: "#4F46E5" },
  { name: "blue", color: "#3B82F6" },
  { name: "green", color: "#22C55E" },
  { name: "amber", color: "#F59E0B" },
  { name: "red", color: "#EF4444" },
  { name: "rose", color: "#F43F5E" },
  { name: "teal", color: "#14B8A6" },
  { name: "cyan", color: "#06B6D4" },
  { name: "fuchsia", color: "#D946EF" },
  { name: "pink", color: "#EC4899" },
  { name: "orange", color: "#F97316" },
  { name: "yellow", color: "#EAB308" },
  { name: "lime", color: "#84CC16" },
  { name: "emerald", color: "#10B981" },
  { name: "violet", color: "#8B5CF6" },
  { name: "zinc", color: "#71717A" },
  { name: "sky", color: "#0EA5E9" },
];

export function ColorSwatchGrid({ value, onChange, className }) {
  return (
    <div className={clsx("grid grid-cols-6 sm:grid-cols-6 gap-3", className)}>
      {primaryColorOptions.map((option) => (
        <button
          key={option.name}
          type="button"
          onClick={() => onChange(option.name)}
          className={clsx(
            "w-10 h-10 rounded-full transition-transform hover:scale-110 active:scale-95",
            value === option.name
              ? "ring-2 ring-offset-2 ring-primary dark:ring-offset-dark-800"
              : "ring-0"
          )}
          style={{ backgroundColor: option.color }}
          aria-label={option.name}
          title={option.name}
        />
      ))}
    </div>
  );
}
