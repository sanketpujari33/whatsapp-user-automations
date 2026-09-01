// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { TbUser } from "react-icons/tb";
import { MdOutlinePassword } from "react-icons/md";

import { Link, useNavigate } from "react-router";

// Local Imports
import { Avatar, AvatarDot, Button } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { toast } from "sonner";
import { ConfirmModal } from "components/shared";
import { useDisclosure } from "hooks";
import { routes } from "constants/routeconstants";

// ----------------------------------------------------------------------

const links = [
  {
    id: "1",
    title: "Profile",
    description: "Admin profile",
    to: routes.adminProfile?.adminProfilePage || "/profile",
    Icon: TbUser,
    color: "warning",
  },
  {
    id: "2",
    title: "Change Password",
    description: "Create New Password",
    to: routes.changePassword || "/change-password",
    Icon: MdOutlinePassword,
    color: "info",
  },
];

export function Profile() {
  const { logout, adminData } = useAuthContext();
  const [isOpen, { open, close }] = useDisclosure();
  const navigate = useNavigate();

  const messages = {
    pending: {
      Icon: ExclamationTriangleIcon,
      title: "Are you sure you want to log out?",
      description: "",
      actionText: "Logout",
    },
  };

  const onOk = async () => {
    await logout();
    toast.success("Logout!");
    close();
  };

  return (
    <>
      <Popover className="relative flex">
        <PopoverButton
          as={Avatar}
          size={9}
          role="button"
          src={adminData?.image || `${import.meta.env.BASE_URL}images/placeholders/100x100.png`}
          indicator={
            <AvatarDot
              color="success"
              className="-m-0.5 size-3 ltr:right-0 rtl:left-0"
            />
          }
          classNames={{
            root: "cursor-pointer",
          }}
        />
        <Transition
          enter="duration-200 ease-out"
          enterFrom="translate-y-2 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="duration-200 ease-out"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="translate-y-2 opacity-0"
        >
          <PopoverPanel
            anchor={{ to: "bottom end", gap: 12 }}
            className="border-gray-150 shadow-soft dark:border-dark-600 dark:bg-dark-700 z-70 flex w-64 flex-col rounded-lg border bg-white transition dark:shadow-none"
          >
            {({ close }) => (
              <>
                <div className="dark:bg-dark-800 bg-secondary flex items-center gap-4 rounded-t-lg px-4 py-5">
                  <Avatar size={14} src={adminData?.image || `${import.meta.env.BASE_URL}images/placeholders/100x100.png`} />
                  <div>
                    <p className="focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400 text-base font-medium text-white hover:text-white">
                      {adminData?.name || "Admin User"}
                    </p>

                    <p className="dark:text-dark-300 mt-0.5 text-xs text-gray-400">
                      {adminData?.email || "admin@example.com"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col pt-2 pb-5">
                  {links.map((link) => (
                    <Link
                      key={link.id}
                      to={link.to}
                      onClick={close}
                      className="group dark:hover:bg-dark-600 dark:focus:bg-dark-600 flex items-center gap-3 px-4 py-2 tracking-wide outline-hidden transition-all hover:bg-gray-100 focus:bg-gray-100"
                    >
                      <Avatar
                        size={8}
                        initialColor={link.color}
                        classNames={{ display: "rounded-lg" }}
                      >
                        <link.Icon className="size-4.5" />
                      </Avatar>
                      <div>
                        <h2 className="group-hover:text-primary-600 group-focus:text-primary-600 dark:text-dark-100 dark:group-hover:text-primary-400 dark:group-focus:text-primary-400 font-medium text-gray-800 transition-colors">
                          {link.title}
                        </h2>
                        <div className="dark:text-dark-300 truncate text-xs text-gray-400">
                          {link.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="px-4 pt-4">
                    <Button
                      onClick={() => {
                        open();
                      }}
                      color="secondary"
                      className="w-full gap-2"
                    >
                      <ArrowLeftStartOnRectangleIcon className="size-4.5 text-white" />
                      <span className="text-white">Logout</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
      <ConfirmModal
        show={isOpen}
        onClose={close}
        messages={messages}
        onOk={onOk}
        state={"pending"}
      />
    </>
  );
}
