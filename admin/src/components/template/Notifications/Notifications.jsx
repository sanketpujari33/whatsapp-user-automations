// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from "@headlessui/react";
import PropTypes from "prop-types";
import {
  ArchiveBoxXMarkIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import clsx from "clsx";
import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationss as fetchNotifications, deleteNotifications as deleteNotifRedux } from "store/actions/notificationsAction";

// Local Imports
import { Avatar, AvatarDot, Badge, Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import AlarmIcon from "assets/dualicons/alarm.svg?react";
import GirlEmptyBox from "assets/illustrations/girl-empty-box.svg?react";

// ----------------------------------------------------------------------

const types = {
  message: {
    title: "Message",
    Icon: EnvelopeIcon,
    color: "info",
  },
  task: {
    title: "Task",
    Icon: IoCheckmarkDoneOutline,
    color: "success",
  },
  log: {
    title: "Log",
    Icon: DocumentTextIcon,
    color: "neutral",
  },
  security: {
    title: "Security",
    Icon: ExclamationTriangleIcon,
    color: "error",
  },
};



const typesKey = Object.keys(types);

export function Notifications() {
  const dispatch = useDispatch();
  const reduxList = useSelector((state) => {
    const data = state.notifications?.data;
    return Array.isArray(data) ? data : [];
  });

  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Visible notifications after locally-dismissed ones are hidden
  const notifications = reduxList.filter(
    (item) => !hiddenIds.has(item.id || item._id),
  );

  const filteredNotifications = notifications.filter(
    (notification) => notification.type === Object.keys(types)[activeTab - 1],
  );

  const removeNotification = async (id) => {
    // Optimistically hide immediately, then dispatch delete
    setHiddenIds((prev) => new Set(prev).add(id));
    try {
      await dispatch(deleteNotifRedux(id)).unwrap();
    } catch (err) {
      console.error('Failed to remove notification', err);
      // Keep hidden even on failure (optimistic UX)
    }
  };

  const clearNotifications = () => {
    if (activeTab === 0) {
      setHiddenIds(new Set(reduxList.map((n) => n.id || n._id)));
    } else {
      const idsToHide = reduxList
        .filter((n) => n.type === typesKey[activeTab - 1])
        .map((n) => n.id || n._id);
      setHiddenIds((prev) => new Set([...prev, ...idsToHide]));
    }
  };

  return (
    <Popover className="relative flex">
      <PopoverButton
        as={Button}
        variant="flat"
        isIcon
        className="relative size-9 rounded-full"
      >
        <AlarmIcon className="size-6 text-white" />
        {notifications.length > 0 && (
          <AvatarDot
            color="error"
            isPing
            className="top-0 ltr:right-0 rtl:left-0"
          />
        )}
      </PopoverButton>
      <Transition
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <PopoverPanel
          anchor={{ to: "bottom end", gap: 8 }}
          className="border-gray-150 shadow-soft dark:border-dark-800 dark:bg-dark-700 dark:shadow-soft-dark z-70 mx-4 flex h-[min(32rem,calc(100vh-6rem))] w-[calc(100vw-2rem)] flex-col rounded-lg border bg-white sm:m-0 sm:w-80"
        >
          {({ close }) => (
            <div className="flex grow flex-col overflow-hidden">
              <div className="dark:bg-dark-800 rounded-t-lg bg-gray-100">
                <div className="flex items-center justify-between px-4 pt-2">
                  <div className="flex items-center gap-2">
                    <h3 className="dark:text-dark-100 font-medium text-gray-800">
                      Notifications
                    </h3>
                    {notifications.length > 0 && (
                      <Badge
                        color="primary"
                        className="h-5 rounded-full px-1.5"
                        variant="soft"
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    component={Link}
                    to="/settings/notifications"
                    className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                    isIcon
                    variant="flat"
                    onClick={close}
                  >
                    <Cog6ToothIcon className="size-4.5" />
                  </Button>
                </div>
              </div>
              <TabGroup
                as={Fragment}
                selectedIndex={activeTab}
                onChange={setActiveTab}
              >
                <TabList className="hide-scrollbar dark:bg-dark-800 flex shrink-0 overflow-x-auto scroll-smooth   text-white  bg-secondary px-3">
                  <Tab
                    onFocus={(e) => {
                      e.target.parentNode.scrollLeft =
                        e.target.offsetLeft -
                        e.target.parentNode.offsetWidth / 2;
                    }}
                    className={({ selected }) =>
                      clsx(
                        "shrink-0 cursor-pointer rounded-lg px-3 py-1.5 font-medium whitespace-nowrap outline-0",
                        selected
                          ? "dark:bg-surface-2 text-secondary dark:text-dark-100 bg-white shadow"
                          : "dark:hover:text-dark-100 dark:focus:text-dark-100 hover:text-white focus:text-gray-800",
                      )
                    }
                    as={Button}
                    unstyled
                  >
                    All
                  </Tab>
                  {typesKey.map((key) => (
                    <Tab
                      onFocus={(e) => {
                        e.target.parentNode.scrollLeft =
                          e.target.offsetLeft -
                          e.target.parentNode.offsetWidth / 2;
                      }}
                      key={key}
                      className={({ selected }) =>
                        clsx(
                          "shrink-0 scroll-mx-16 border-b-2 px-3 py-2 font-medium whitespace-nowrap",
                          selected
                            ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                            : "dark:hover:text-dark-100 dark:focus:text-dark-100 border-transparent hover:text-gray-800 focus:text-gray-800",
                        )
                      }
                      as={Button}
                      unstyled
                    >
                      {types[key].title}
                    </Tab>
                  ))}
                </TabList>
                {(notifications.length > 0 && activeTab === 0) ||
                filteredNotifications.length > 0 ? (
                  <TabPanels as={Fragment}>
                    <TabPanel className="custom-scrollbar grow space-y-4 overflow-x-hidden overflow-y-auto p-4 outline-hidden">
                      {notifications.map((item) => (
                        <NotificationItem
                          key={item.id || item._id}
                          remove={removeNotification}
                          data={item}
                        />
                      ))}
                    </TabPanel>
                    {typesKey.map((key) => (
                      <TabPanel
                        key={key}
                        className="custom-scrollbar scrollbar-hide grow space-y-4 overflow-x-hidden overflow-y-auto p-4"
                      >
                        {filteredNotifications.map((item) => (
                          <NotificationItem
                            key={item.id || item._id}
                            remove={removeNotification}
                            data={item}
                          />
                        ))}
                      </TabPanel>
                    ))}
                  </TabPanels>
                ) : (
                  <Empty />
                )}
              </TabGroup>
              {((notifications.length > 0 && activeTab === 0) ||
                filteredNotifications.length > 0) && (
                <div className="dark:bg-dark-800 shrink-0 overflow-hidden rounded-b-lg bg-gray-100">
                  <Button
                    // variant="flat"
                    className="w-full rounded-t-none"
                    onClick={clearNotifications}
                  >
                    <span>Archive all notifications</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

function Empty() {
  const { primaryColorScheme: primary, darkColorScheme: dark } =
    useThemeContext();
  return (
    <div className="grid grow place-items-center text-center">
      <div className="">
        <GirlEmptyBox
          className="mx-auto w-40"
          style={{ "--primary": primary[500], "--dark": dark[500] }}
        />
        <div className="mt-6">
          <p>No new notifications yet</p>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ data, remove }) {
  const Icon = types[data.type].Icon;
  return (
    <div className="group flex items-center justify-between gap-3">
      <div className="flex min-w-0 gap-3">
        <Avatar
          size={10}
          initialColor={types[data.type].color}
          classNames={{ display: "rounded-lg" }}
        >
          <Icon className="size-4.5" />
        </Avatar>
        <div className="min-w-0">
          <p className="dark:text-dark-100 -mt-0.5 truncate font-medium text-gray-800">
            {data.title}
          </p>
          <div className="mt-0.5 truncate text-xs">{data.description}</div>
          <div className="dark:text-dark-300 mt-1 truncate text-xs text-gray-400">
            {data.time}
          </div>
        </div>
      </div>
      <Button
        variant="flat"
        isIcon
        onClick={() => remove(data.id || data._id)}
        className="size-7 rounded-full opacity-0 group-hover:opacity-100 ltr:-mr-2 rtl:-ml-2"
      >
        <ArchiveBoxXMarkIcon className="size-4" />
      </Button>
    </div>
  );
}

NotificationItem.propTypes = {
  data: PropTypes.object,
  remove: PropTypes.func,
};
