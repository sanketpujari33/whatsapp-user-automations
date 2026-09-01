import clsx from "clsx";

export function LivePreview({ className, children }) {
  return (
    <div className={clsx("space-y-5", className)}>
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-500 rounded-xl p-5 sticky top-24 overflow-hidden">
        <h3 className="text-sm font-semibold mb-4 text-gray-800 dark:text-dark-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Live Preview
        </h3>
        {children || (
          <div className="rounded-lg border border-gray-200 dark:border-dark-500 bg-white dark:bg-dark-700 overflow-hidden shadow-sm">
            <div className="h-8 bg-primary w-full flex items-center px-2 gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-12 h-1.5 rounded bg-white/20" />
            </div>
            <div className="p-3 space-y-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20" />
                <div className="flex-1 space-y-1">
                  <div className="w-1/2 h-2 bg-gray-200 dark:bg-dark-500 rounded" />
                  <div className="w-1/4 h-1.5 bg-gray-100 dark:bg-dark-600 rounded" />
                </div>
              </div>
              <div className="h-16 w-full bg-gray-100 dark:bg-dark-600 rounded-lg flex items-center justify-center text-[10px] text-gray-400 dark:text-dark-300 italic">
                Content Area
              </div>
              <div className="flex justify-end">
                <div className="w-12 h-4 bg-primary rounded text-white flex items-center justify-center text-[8px]">Button</div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg">
          <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Quick Tip</p>
          <p className="text-xs text-gray-500 dark:text-dark-300 italic">
            Changes are applied instantly. Use &quot;Reset to Defaults&quot; to revert.
          </p>
        </div>
      </div>
    </div>
  );
}
