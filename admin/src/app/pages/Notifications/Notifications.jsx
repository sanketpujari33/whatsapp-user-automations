import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Spinner,
} from 'components/ui';
import { BellRing, Pencil, Plus, RefreshCcw, Save, Trash2, X } from 'lucide-react';
import withRouteGuard from 'middleware/withRouteGuard';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  createNotifications,
  deleteNotifications,
  getNotificationss,
  updateNotifications,
  updateNotificationsStatus,
} from 'store/actions/notificationsAction';
import { clearError } from 'store/slices/notificationsSlice';

const NOTIFICATION_TYPES = [
  { value: 'message', label: 'Message' },
  { value: 'task', label: 'Task' },
  { value: 'log', label: 'Log' },
  { value: 'security', label: 'Security' },
];

const INITIAL_FORM = {
  title: '',
  description: '',
  type: 'message',
  isActive: true,
};

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function NotificationsSettings() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.notifications);

  const notifications = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNotifications = useCallback(async () => {
    await dispatch(
      getNotificationss({
        includeInactive: true,
        page: 1,
        limit: 200,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearError());
    loadNotifications();
  }, [dispatch, loadNotifications]);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setSubmitError('');
    setSubmitMessage('');
  }, []);

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSubmitError('');
      setSubmitMessage('');

      if (!form.title.trim()) {
        setSubmitError('Title is required.');
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        isActive: Boolean(form.isActive),
      };

      setIsSubmitting(true);
      try {
        if (editingId) {
          await dispatch(updateNotifications({ id: editingId, data: payload })).unwrap();
          setSubmitMessage('Notification updated successfully.');
        } else {
          await dispatch(createNotifications(payload)).unwrap();
          setSubmitMessage('Notification created successfully.');
        }

        await loadNotifications();
        setForm(INITIAL_FORM);
        setEditingId(null);
      } catch (saveError) {
        setSubmitError(saveError || 'Unable to save notification.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, editingId, form, loadNotifications],
  );

  const onEdit = useCallback((notification) => {
    const id = notification.id || notification._id;
    if (!id) return;

    setEditingId(id);
    setForm({
      title: notification.title || '',
      description: notification.description || '',
      type: notification.type || 'message',
      isActive: notification.isActive !== false,
    });
    setSubmitError('');
    setSubmitMessage('');
  }, []);

  const onToggleStatus = useCallback(
    async (notification) => {
      const id = notification.id || notification._id;
      if (!id) return;

      setSubmitError('');
      setSubmitMessage('');

      try {
        await dispatch(
          updateNotificationsStatus({
            id,
            data: { isActive: !notification.isActive },
          }),
        ).unwrap();

        setSubmitMessage('Notification status updated.');
        await loadNotifications();
      } catch (statusError) {
        setSubmitError(statusError || 'Unable to update status.');
      }
    },
    [dispatch, loadNotifications],
  );

  const onDelete = useCallback(
    async (notification) => {
      const id = notification.id || notification._id;
      if (!id) return;

      const ok = window.confirm('Are you sure you want to delete this notification?');
      if (!ok) return;

      setSubmitError('');
      setSubmitMessage('');

      try {
        await dispatch(deleteNotifications(id)).unwrap();
        setSubmitMessage('Notification deleted.');
        await loadNotifications();

        if (editingId === id) {
          resetForm();
        }
      } catch (deleteError) {
        setSubmitError(deleteError || 'Unable to delete notification.');
      }
    },
    [dispatch, editingId, loadNotifications, resetForm],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Settings"
        subtitle="Create and manage notifications shown in the admin notification dropdown."
        actions={
          <>
            <Button
              variant="soft"
              color="info"
              className="gap-2"
              onClick={loadNotifications}
              disabled={isLoading}
            >
              <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button color="primary" className="gap-2" onClick={resetForm}>
              <Plus size={16} />
              New Notification
            </Button>
          </>
        }
      />

      {(error || submitError || submitMessage) && (
        <Card skin="shadow-sm" className="p-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}
          {!error && submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300">
              {submitError}
            </div>
          )}
          {!error && !submitError && submitMessage && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/20 dark:text-emerald-300">
              {submitMessage}
            </div>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card skin="shadow-sm" className="p-5 xl:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <BellRing size={16} />
            <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">
              {editingId ? 'Edit Notification' : 'Create Notification'}
            </h3>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="input w-full"
                placeholder="Enter notification title"
                maxLength={160}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Type
              </label>
              <select
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                className="input w-full"
              >
                {NOTIFICATION_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                className="input min-h-[120px] w-full"
                placeholder="Enter notification description"
                maxLength={1000}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={Boolean(form.isActive)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, isActive: event.target.checked }))
                }
              />
              Active
            </label>

            <div className="flex items-center gap-2">
              <Button type="submit" color="primary" className="gap-2" disabled={isSubmitting}>
                <Save size={16} />
                {editingId ? 'Update' : 'Create'}
              </Button>

              {editingId && (
                <Button type="button" variant="outlined" color="neutral" className="gap-2" onClick={resetForm}>
                  <X size={16} />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card skin="shadow-sm" className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-dark-600">
            <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Notification List</h3>
            <Badge variant="soft" color="primary">
              {notifications.length} items
            </Badge>
          </div>

          {isLoading && notifications.length === 0 && (
            <div className="flex justify-center py-10">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="p-5">
              <EmptyState
                icon="🔔"
                title="No notifications available"
                description="Create your first notification using the form."
              />
            </div>
          )}

          {!isLoading && notifications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-700">
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Title</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Type</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Created</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => {
                    const rowId = notification.id || notification._id;
                    return (
                      <tr key={rowId} className="border-t border-gray-100 dark:border-dark-600">
                        <td className="px-5 py-3">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {notification.title || '-'}
                          </div>
                          <div className="mt-0.5 max-w-md truncate text-xs text-gray-500 dark:text-gray-300">
                            {notification.description || '-'}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200">
                          <Badge variant="soft" color="info">{notification.type || '-'}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant="soft" color={notification.isActive ? 'success' : 'neutral'}>
                            {notification.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(notification.createdAt)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="soft"
                              color="primary"
                              className="gap-1"
                              onClick={() => onEdit(notification)}
                            >
                              <Pencil size={14} />
                              Edit
                            </Button>
                            <Button
                              variant="soft"
                              color={notification.isActive ? 'warning' : 'success'}
                              onClick={() => onToggleStatus(notification)}
                            >
                              {notification.isActive ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              variant="soft"
                              color="error"
                              className="gap-1"
                              onClick={() => onDelete(notification)}
                            >
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {error && notifications.length === 0 && <ErrorState message={error} onRetry={loadNotifications} />}
    </div>
  );
}

const GuardedNotificationsSettings = withRouteGuard(NotificationsSettings, 'config');
GuardedNotificationsSettings.displayName = 'GuardedNotificationsSettings';

export default GuardedNotificationsSettings;
