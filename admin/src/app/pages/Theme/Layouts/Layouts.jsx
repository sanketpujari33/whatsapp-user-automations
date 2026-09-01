import { useThemeContext } from "app/contexts/theme/context";
import withRouteGuard from "middleware/withRouteGuard";
import { toast } from "sonner";
import clsx from "clsx";
import { Card } from "components/ui";
import { Button } from "components/ui";
import { Switch } from "components/ui/Form";
import { LivePreview } from "components/pages/settings";

const layoutOptions = [
  {
    id: "sideblock",
    name: "Sideblock",
    description: "Single sidebar panel — clean and focused",
    preview: (
      <div className="flex h-full">
        <div className="w-1/3 bg-[var(--color-primary-700)] rounded-l" />
        <div className="flex-1 bg-gray-100 dark:bg-dark-600 rounded-r flex items-center justify-center">
          <div className="w-3/4 h-2 bg-gray-300 dark:bg-dark-400 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "main-layout",
    name: "Main Layout",
    description: "Two-panel sidebar with prime navigation panel",
    preview: (
      <div className="flex h-full">
        <div className="w-1/6 bg-[var(--color-primary-600)] rounded-l" />
        <div className="w-1/3 bg-[var(--color-primary-700)]" />
        <div className="flex-1 bg-gray-100 dark:bg-dark-600 rounded-r flex items-center justify-center">
          <div className="w-3/4 h-2 bg-gray-300 dark:bg-dark-400 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "horizontal",
    name: "Horizontal",
    description: "Top navigation bar — no sidebar, maximal content width",
    preview: (
      <div className="flex flex-col h-full">
        <div className="h-4 bg-[var(--color-primary-600)] rounded-t shrink-0" />
        <div className="flex-1 bg-gray-100 dark:bg-dark-600 rounded-b flex items-center justify-center">
          <div className="w-3/4 h-2 bg-gray-300 dark:bg-dark-400 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "compact",
    name: "Compact",
    description: "Minimal sidebar — maximum workspace for data-heavy views",
    preview: (
      <div className="flex h-full">
        <div className="w-[12%] bg-[var(--color-primary-700)] rounded-l flex items-center justify-center">
          <div className="w-2 h-6 bg-white/20 rounded" />
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-dark-600 rounded-r flex items-center justify-center">
          <div className="w-3/4 h-2 bg-gray-300 dark:bg-dark-400 rounded" />
        </div>
      </div>
    ),
  },
];

function LayoutsComponent() {
  const { themeLayout, cardSkin, setThemeLayout, setCardSkin, resetTheme } = useThemeContext();

  const handleLayoutChange = (layoutId) => {
    setThemeLayout(layoutId);
    toast.success(`Layout switched to ${layoutOptions.find(l => l.id === layoutId)?.name}`);
  };

  const handleCardSkinChange = (e) => {
    const skin = e.target.checked ? "shadow-sm" : "bordered";
    setCardSkin(skin);
    toast.success(`Card skin set to ${skin}`);
  };

  const handleReset = () => {
    resetTheme();
    toast.success("Layout reset to defaults");
  };

  return (
    <div className="my-5 flex flex-col gap-5">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Layout Settings</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">Configure the page layout structure and behavior.</p>
          </div>
          <Button variant="outlined" onClick={handleReset}>Reset to Defaults</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100 mb-4">Layout Type</h2>
            <div className="grid grid-cols-2 gap-6">
              {layoutOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleLayoutChange(option.id)}
                  className={clsx(
                    "group relative text-left p-1 rounded-xl bg-white dark:bg-dark-800 overflow-hidden transition-all",
                    themeLayout === option.id
                      ? "border-2 border-primary ring-2 ring-primary ring-offset-4 dark:ring-offset-dark-900"
                      : "border border-gray-200 dark:border-dark-500 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg"
                  )}
                >
                  <div className="aspect-video w-full rounded-lg overflow-hidden">{option.preview}</div>
                  <div className="p-3">
                    <p className={clsx("font-medium text-sm", themeLayout === option.id ? "text-primary" : "text-gray-800 dark:text-dark-100")}>{option.name}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-300 mt-0.5">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-100 mb-4">Card Skin</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-500">
              <div>
                <p className="font-medium text-gray-800 dark:text-dark-100">Shadow Cards</p>
                <p className="text-sm text-gray-500 dark:text-dark-300">Use elevated shadows instead of borders for cards.</p>
              </div>
              <Switch color="primary" checked={cardSkin === "shadow-sm"} onChange={handleCardSkinChange} />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <LivePreview>
            <div className="rounded-lg border border-gray-200 dark:border-dark-500 bg-white dark:bg-dark-700 overflow-hidden shadow-sm">
              <div className="h-8 bg-[var(--color-primary-700)] w-full flex items-center px-2 gap-2">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <div className="w-12 h-1.5 rounded bg-white/20" />
              </div>
              <div className="p-3 space-y-3">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-200 dark:bg-purple-800" />
                  <div className="flex-1 space-y-1">
                    <div className="w-1/2 h-2 bg-gray-200 dark:bg-dark-500 rounded" />
                    <div className="w-1/4 h-1.5 bg-gray-100 dark:bg-dark-600 rounded" />
                  </div>
                </div>
                <div className="h-16 w-full bg-gray-100 dark:bg-dark-600 rounded-lg flex items-center justify-center text-[10px] text-gray-400 dark:text-dark-300 italic">
                  {themeLayout === "main-layout" ? "Two-Panel Layout" : themeLayout === "horizontal" ? "Horizontal Layout" : themeLayout === "compact" ? "Compact Layout" : "Sideblock Layout"}
                </div>
              </div>
            </div>
          </LivePreview>
        </div>
      </div>
    </div>
  );
}

export default withRouteGuard(LayoutsComponent, "theme/layouts");
