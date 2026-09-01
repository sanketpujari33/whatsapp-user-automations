import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Spinner,
  Textarea,
} from "components/ui";
import { CheckCircle2, Database, RefreshCcw, Save, ShieldCheck } from "lucide-react";
import withRouteGuard from "middleware/withRouteGuard";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getConfigActive,
  getConfigById,
  getConfigList,
  getEffectiveConstants,
  reloadRuntimeConstants,
  upsertActiveConfig,
} from "store/actions/configAction";
import { clearConfigError, clearConfigSuccess } from "store/slices/configSlice";

function toPrettyJson(value) {
  if (!value) return "{}";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{}";
  }
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function ConfigManager() {
  const dispatch = useAppDispatch();
  const {
    activeConfig,
    selectedConfig,
    effectiveConstants,
    list,
    pagination,
    runtimeInfo,
    isLoading,
    isListLoading,
    isByIdLoading,
    isSaving,
    isReloading,
    error,
    successMessage,
  } = useAppSelector((state) => state.config);

  const [editorValue, setEditorValue] = useState("{}");
  const [editorError, setEditorError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const loadPage = useCallback(
    (page = 1, limit = pagination.limit || 10) => {
      dispatch(getConfigList({ page, limit }));
    },
    [dispatch, pagination.limit],
  );

  const bootstrap = useCallback(() => {
    dispatch(clearConfigError());
    dispatch(getConfigActive());
    dispatch(getEffectiveConstants());
    loadPage(1, pagination.limit || 10);
  }, [dispatch, loadPage, pagination.limit]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!selectedId && activeConfig) {
      setEditorValue(toPrettyJson(activeConfig));
      setEditorError(null);
    }
  }, [activeConfig, selectedId]);

  useEffect(() => {
    if (selectedConfig && selectedId) {
      setEditorValue(toPrettyJson(selectedConfig));
      setEditorError(null);
    }
  }, [selectedConfig, selectedId]);

  const onSave = useCallback(async () => {
    setEditorError(null);
    dispatch(clearConfigError());
    dispatch(clearConfigSuccess());

    let payload;
    try {
      payload = JSON.parse(editorValue || "{}");
    } catch {
      setEditorError("Invalid JSON format. Please fix the editor content before saving.");
      return;
    }

    await dispatch(upsertActiveConfig(payload));
    dispatch(getConfigActive());
    dispatch(getEffectiveConstants());
    loadPage(pagination.page || 1, pagination.limit || 10);
    setSelectedId(null);
  }, [dispatch, editorValue, loadPage, pagination.limit, pagination.page]);

  const onReloadRuntime = useCallback(async () => {
    dispatch(clearConfigError());
    dispatch(clearConfigSuccess());
    await dispatch(reloadRuntimeConstants());
    dispatch(getEffectiveConstants());
  }, [dispatch]);

  const onLoadVersion = useCallback(
    async (id) => {
      setSelectedId(id);
      dispatch(clearConfigError());
      await dispatch(getConfigById({ id }));
    },
    [dispatch],
  );

  const hasAnyData =
    Boolean(activeConfig) ||
    Boolean(effectiveConstants) ||
    (Array.isArray(list) && list.length > 0);

  const canGoPrev = (pagination.page || 1) > 1;
  const canGoNext = (pagination.page || 1) * (pagination.limit || 10) < (pagination.total || 0);

  const effectiveConstantsPreview = useMemo(
    () => toPrettyJson(effectiveConstants || {}),
    [effectiveConstants],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Config Manager"
        subtitle="Manage runtime configuration, inspect effective constants, and refresh the server runtime cache."
        actions={
          <>
            <Button
              variant="soft"
              color="info"
              onClick={onReloadRuntime}
              disabled={isReloading}
              className="gap-2"
            >
              <RefreshCcw size={16} className={isReloading ? "animate-spin" : ""} />
              Reload Runtime
            </Button>
            <Button
              color="primary"
              onClick={onSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save size={16} />
              Save Active Config
            </Button>
          </>
        }
      />

      {error && !hasAnyData && <ErrorState message={error} onRetry={bootstrap} />}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card skin="shadow-sm" className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Active Config Editor</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Edit JSON payload and save it as the active runtime config.
              </p>
            </div>
            <Badge variant="soft" color="primary">
              {selectedId ? "History Snapshot" : "Active"}
            </Badge>
          </div>

          {isLoading && !activeConfig && !selectedConfig && (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {!isLoading && !activeConfig && !selectedConfig && (
            <EmptyState
              icon="⚙️"
              title="No config found yet"
              description="Create your first config by editing JSON and saving it."
            />
          )}

          {(activeConfig || selectedConfig) && (
            <div className="space-y-3">
              <Textarea
                value={editorValue}
                onChange={(event) => setEditorValue(event.target.value)}
                className="min-h-[360px] font-mono text-xs"
              />

              {editorError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300">
                  {editorError}
                </div>
              )}

              {successMessage && (
                <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && hasAnyData && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}
            </div>
          )}
        </Card>

        <Card skin="shadow-sm" className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Effective Constants</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Final constants currently used at runtime (secrets stay masked by API default).
              </p>
            </div>
            <Badge variant="soft" color="info">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck size={12} />
                Runtime
              </span>
            </Badge>
          </div>

          {!effectiveConstants && isLoading && (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {effectiveConstants && (
            <pre className="max-h-[460px] overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700 dark:bg-dark-800 dark:text-gray-200">
              {effectiveConstantsPreview}
            </pre>
          )}

          {!effectiveConstants && !isLoading && (
            <EmptyState
              icon="🧩"
              title="No effective constants loaded"
              description="Click reload runtime to fetch the latest constants from server memory."
            />
          )}

          {runtimeInfo?.runtimeUpdated && (
            <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800 dark:border-sky-700/50 dark:bg-sky-900/20 dark:text-sky-200">
              Runtime reloaded with {runtimeInfo.runtimeKeys?.length || 0} keys.
            </div>
          )}
        </Card>
      </div>

      <Card skin="shadow-sm" className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-dark-600">
          <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Config History</h3>
          <Badge variant="soft" color="warning">
            <span className="inline-flex items-center gap-1">
              <Database size={12} />
              {pagination.total || 0} total
            </span>
          </Badge>
        </div>

        {isListLoading && (
          <div className="flex justify-center py-10">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {!isListLoading && (!Array.isArray(list) || list.length === 0) && (
          <div className="p-5">
            <EmptyState
              icon="🗂️"
              title="No config history"
              description="Saved config snapshots will appear here after the first save."
            />
          </div>
        )}

        {!isListLoading && Array.isArray(list) && list.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-700">
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">ID</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Created</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Updated</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((row) => {
                    const rowId = row.id || row._id;
                    return (
                      <tr
                        key={rowId}
                        className={`border-t border-gray-100 dark:border-dark-600 ${
                          rowId && rowId === selectedId ? "bg-primary-50/40 dark:bg-primary-500/10" : ""
                        }`}
                      >
                        <td className="px-5 py-3 text-xs text-gray-700 dark:text-gray-200">{rowId || "-"}</td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(row.updatedAt)}</td>
                        <td className="px-5 py-3">
                          <Button
                            variant="soft"
                            color="primary"
                            className="gap-1"
                            onClick={() => onLoadVersion(rowId)}
                            disabled={!rowId || isByIdLoading}
                          >
                            Load
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4">
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => loadPage((pagination.page || 1) - 1, pagination.limit || 10)}
                disabled={!canGoPrev || isListLoading}
              >
                Previous
              </Button>
              <Badge variant="soft" color="neutral">
                Page {pagination.page || 1}
              </Badge>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => loadPage((pagination.page || 1) + 1, pagination.limit || 10)}
                disabled={!canGoNext || isListLoading}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

const GuardedConfigManager = withRouteGuard(ConfigManager, "config");
GuardedConfigManager.displayName = "GuardedConfigManager";

export default GuardedConfigManager;
