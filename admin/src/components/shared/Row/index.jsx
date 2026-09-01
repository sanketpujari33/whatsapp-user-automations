
import {
  MdAccountBalance,
  MdCreditCard,
  MdDelete,
  MdEdit,
  MdEmail,
  MdPerson,
  MdPhoneIphone,
} from "react-icons/md";

import { Highlight } from "../Highlight";
import { ensureString } from 'utils/format/ensureString';
import clsx from "clsx";
import { Avatar, Button } from "components/ui";
// import { setThisClass } from 'utils/helpers/setThisClass';
import { format, parse } from "date-fns";
import { useNavigate } from "react-router";
import {
  // Menu,
  // MenuButton,
  // MenuItem,
  // MenuItems,
  Popover,
  // Transition,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
// import { Fragment } from "react";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { routes } from "constants/routeconstants";
import dayjs from "dayjs";
import { toast } from "sonner";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const BASE_PATH = import.meta.env.VITE_PROJECT_NAME || '';

export function IdCell({ row, table }, value) {
  const query = ensureString(table.getState().globalFilter);
  console.log({ value });
  return (
    <div className="-mx-2 flex items-center space-x-2">
      {row.getCanExpand() ? (
        <Button
          isIcon
          className="size-5"
          variant="flat"
          onClick={row.getToggleExpandedHandler()}
        >
          <ChevronUpIcon
            className={clsx(
              "size-4 transition-transform",
              row.getIsExpanded() && "rotate-180",
            )}
          />
        </Button>
      ) : null}
      <span>
        <Highlight query={query}>{value}</Highlight>
      </span>
    </div>
  );
}

export function NameCell({ row, getValue, table }) {
  const name = getValue();
  const query = ensureString(table.getState().globalFilter);

  return (
    <div className="flex items-center space-x-4">
      <Avatar
        size={9}
        name={name}
        initialColor="auto"
        classNames={{ initial: "text-xs-plus" }}
      />
      <span className="dark:text-dark-100 font-medium text-gray-800">
        <Highlight query={query}>{name}</Highlight>
      </span>
    </div>
  );
}

export function PositionCell({ getValue, table }) {
  const query = ensureString(table.getState().globalFilter);

  return (
    <p className="dark:text-dark-100 font-medium text-gray-800">
      <Highlight query={query}>
        {getValue() === 0 ? 0 : !getValue() ? "-" : getValue()}
      </Highlight>
    </p>
  );
}

export function DatesCell({ getValue, table }) {
  const query = ensureString(table.getState().globalFilter);

  function formatDate(dateString) {
    const date = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
    return format(date, " MMMM do yyyy, hh:mm:ss a");
  }

  const dateValue = getValue();
  return (
    <p className="dark:text-dark-100 font-medium text-gray-800">
      <Highlight query={query}>{formatDate(dateValue)}</Highlight>
    </p>
  );
}

export function SubAdminDate({ getValue, table }) {
  const query = ensureString(table.getState().globalFilter);

  const formattedDate = dayjs(getValue()).format("DD-MM-YYYY hh:mm:ss a");
  return (
    <p className="dark:text-dark-100 font-medium text-gray-800">
      <Highlight query={query}>{formattedDate}</Highlight>
    </p>
  );
}

export function ImageCell({ getValue }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-9">
        <img src={getValue()} alt={"Avatar"} className="h-full w-full" />
      </div>
    </div>
  );
}

export function ImageEditCell(
  row,
  setOpenModal,
  setSelectedRow,
  editProfilePermission,
  type,
) {
  console.log({ type });
  return (
    <div
      onClick={() => {
        if (editProfilePermission && type === "players") {
          setOpenModal(true);
          setSelectedRow(row?.row?.original);
        }
        if (editProfilePermission && type === "teams") {
          setOpenModal(true);
          setSelectedRow(row?.row?.original);
        }
      }}
      className="relative w-fit cursor-pointer"
    >
      <Avatar
        className="rounded-[50%] border-[4px]"
        src={row?.row?.original?.image || row?.row?.original?.logo}
      />
      {editProfilePermission && type === "players" ? (
        <span className="absolute top-[1px] right-[-5px] rounded-[50%] border-[2px] bg-white shadow-2xs">
          <MdEdit className="text-primary-800 size-3" />
        </span>
      ) : (
        ""
      )}
      {editProfilePermission && type === "teams" ? (
        <span className="absolute top-[1px] right-[-5px] rounded-[50%] border-[2px] bg-white shadow-2xs">
          <MdEdit className="text-primary-800 size-3" />
        </span>
      ) : (
        ""
      )}
    </div>
  );
}

export function StatusCell({ getValue, row, table }) {
  const query = ensureString(table.getState().globalFilter);
  return (
    <span className="inline-flex items-center space-x-2 leading-none">
      {/* <span
        className={clsx(
          "border-this dark:border-this-light size-3 rounded-full border-2",
          setThisClass(
            getValue() ? statusColors["secondary"] : statusColors.intern,
          ),
        )}
      ></span> */}
      <span>
        <Highlight query={query}>
          {getValue() ? "Allowed" : "Restricted"}
        </Highlight>
      </span>
    </span>
  );
}

export function BranchStatusCell({ getValue, row, table }) {
  const query = ensureString(table.getState().globalFilter);
  return (
    <span className="inline-flex items-center space-x-2 leading-none">
      {/* <span
        className={clsx(
          "border-this dark:border-this-light size-3 rounded-full border-2",
          setThisClass(
            getValue() ? statusColors["secondary"] : statusColors.intern,
          ),
        )}
      ></span> */}
      <span>
        <Highlight query={query}>
          {getValue() ? "Enabled" : "Disabled"}
        </Highlight>
      </span>
    </span>
  );
}

export function SeriesSatusCell({ getValue, row, table }) {
  const query = ensureString(table.getState().globalFilter);
  return (
    <span className="inline-flex items-center space-x-2 leading-none">
      {/* <span
        className={clsx(
          "border-this dark:border-this-light size-3 rounded-full border-2",
          setThisClass(
            getValue() === "opened"
              ? statusColors["secondary"]
              : statusColors.intern,
          ),
        )}
      ></span> */}
      <span>
        <Highlight query={query}>{getValue()}</Highlight>
      </span>
    </span>
  );
}

export function LeaderBoardStatusCell({ getValue, row, table }) {
  return (
    <p
      className={`${getValue() === "yes" ? "text-primary-800" : "text-warning"}`}
    >
      {getValue().toUpperCase()}{" "}
    </p>
  );
}

export function SeriesActionCell(
  { row },
  updateSeriesStatus,
  updateSeriesLeaderBoardStatus,
  updateSerieautomactchLaunchStatus,
  disableSeriesObj,
  enableDisableObj,
  viewSeriesPriceCardObj,
  enableDisableAutoMatchObj,
) {
  const { original } = row;
  const navigate = useNavigate();
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {disableSeriesObj ? (
            <button
              onClick={() =>
                updateSeriesStatus(
                  original.id,
                  original.status === "opened" ? "closed" : "opened",
                )
              }
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>
                {original.status === "opened"
                  ? "Disable series"
                  : "Enable series "}{" "}
              </span>
            </button>
          ) : (
            ""
          )}

          {enableDisableObj ? (
            <button
              onClick={() => {
                updateSeriesLeaderBoardStatus(
                  original.id,
                  original.has_leaderboard === "yes" ? "no" : "yes",
                );
              }}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>
                {" "}
                {original.has_leaderboard === "no"
                  ? "Enable leaderboard"
                  : "Disable leaderboard"}{" "}
              </span>
            </button>
          ) : (
            ""
          )}

          {enableDisableAutoMatchObj ? (
            <button
              onClick={() => {
                updateSerieautomactchLaunchStatus(
                  original.id,
                  original.automatchlaunch ? "no" : "yes",
                );
              }}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>
                {" "}
                {original.automatchlaunch
                  ? "Disable automatch"
                  : "Enable automatch"}
              </span>
            </button>
          ) : (
            ""
          )}

          {viewSeriesPriceCardObj ? (
            <>
              <hr className="border-gray-150 dark:border-dark-500 mx-3 my-1.5 h-px" />

              <button
                onClick={() =>
                  navigate(
                    `${routes.series.prizeCard}?series-id=${original.id}`,
                  )
                }
                className={
                  "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
                }
              >
                <span>Price card</span>
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function BonusActionCell({ row }, EditBonus) {
  const { original } = row;
  const navigate = useNavigate();

  return (
    <Popover className="relative inline-block text-left">
      {/* Three-dot button */}
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>

      {/* Popover dropdown */}
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          <button
            onClick={() => EditBonus(original)}
            className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
          >
            <span>Edit Bonus</span>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function TeamTypeActionCell({ row, updateToggleStatus, disableTeamObj }) {
  const { original } = row;

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none"
      >
        <div className="flex flex-col">
          {disableTeamObj && (
            <button
              onClick={() =>
                updateToggleStatus(
                  original.id,
                  original.status === "active" ? "Inactive" : "active"
                )
              }
              className="flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100 dark:text-dark-100 dark:bg-dark-700 dark:hover:bg-dark-600"
            >
              <span>
                {original.status === "active" ? "Disable team" : "Enable team"}
              </span>
            </button>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
export function BotUserActiveCell({ row, updateToggleStatus, disableTeamObj }) {
  const { original } = row;

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none"
      >
        <div className="flex flex-col">
          {disableTeamObj && (
            <button
              onClick={() =>
                updateToggleStatus(
                  original.id,
                  original.status === "active" ? "Inactive" : "active"
                )
              }
              className="flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100 dark:text-dark-100 dark:bg-dark-700 dark:hover:bg-dark-600"
            >
              <span>
                {original.status === "active" ? "Disable team" : "Enable team"}
              </span>
            </button>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
export function AllTierStatusCell(
  { row },
  setSelectedEditTier,
  permissions,
  openDeleteModal
) {
  const { original } = row;

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton as={Button} variant="flat" className="size-8 shrink-0 rounded-full p-0">
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {/* Edit Tier */}
          {permissions?.actions?.edit && (
            <button
              onClick={() => setSelectedEditTier(original)}
              className="flex h-9 w-full items-center px-3 text-gray-800 hover:bg-gray-100"
            >
              <PencilIcon className="mr-2 h-5 w-5" />
              Edit
            </button>
          )}

          {/* Delete Tier */}
          {permissions?.actions?.delete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(original); // pass tier to modal
              }}
              className="flex h-9 w-full items-center px-3 text-red-600 hover:bg-red-100"
            >
              <TrashIcon className="mr-2 h-5 w-5" />
              Delete
            </button>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}


export function AllContestCategoryStatusCell(
  { row },
  setSelectedCategory,
  toggleContestCategory,
  setSelectedEditCategory,
  permissions,
) {
  const { original } = row;
  const navigate = useNavigate();
  let isActive = original?.has_leaderBoard;

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {permissions?.actions?.edit ? (
            <button
              onClick={() => {
                setSelectedEditCategory(original);
              }}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <PencilIcon className="mr-2 h-5 w-5" />
              <span>Edit</span>
            </button>
          ) : (
            ""
          )}

          {/* Delete Button */}

          {permissions?.actions?.delete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategory(original);
              }}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-red-600 transition-colors outline-none hover:bg-red-100"
              }
            >
              <TrashIcon className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </button>
          ) : (
            ""
          )}

          {/* Active/Inactive Leaderboard Button */}
          <button
            onClick={() => {
              toggleContestCategory(
                original?._id,
                isActive === "no" ? "yes" : "no",
              );
            }}
            className={`dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide transition-colors outline-none ${isActive === "no"
              ? "text-green-700 hover:bg-green-100"
              : "text-nowrap text-gray-600 hover:bg-gray-100"
              }`}
          >
            {isActive === "no" ? (
              <CheckCircleIcon className="mr-2 h-5 w-5" />
            ) : (
              <XCircleIcon className="mr-2 h-5 w-5" />
            )}
            <span>
              {isActive === "no"
                ? "Active Leaderboard"
                : "Inactive Leaderboard"}
            </span>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function SubAdminActionCell({ row }, setSelectedSubadmin, permissions) {
  const { original } = row;

  const navigate = useNavigate();
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {permissions?.actions?.edit ? (
            <button
              onClick={() =>
                navigate(`${routes.admin.addSubadmin}?id=${original._id}`)
              }
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center gap-2 px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <MdEdit className="text-primary-800 size-4" />
              <span>Edit</span>
            </button>
          ) : (
            ""
          )}

          {permissions?.actions?.delete ? (
            <button
              onClick={() => setSelectedSubadmin(original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center gap-2 px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <MdDelete className="size-4 text-red-600" />
              <span>Delete</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
export function ExpertActionCell({ row, setSelectedExpert, handleEdit, handleDelete, permissions }) {
  const { original } = row;
  const navigate = useNavigate();

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {/* ✅ Edit Button */}
          {permissions?.actions?.edit && (
            <button
              onClick={() => handleEdit(original)}
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center gap-2 px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <MdEdit className="text-primary-800 size-4" />
              <span>Edit</span>
            </button>
          )}

          {/* ✅ Delete Button */}
          {permissions?.actions?.delete && (
            <button
              onClick={() => handleDelete(original._id)}
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center gap-2 px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <MdDelete className="size-4 text-red-600" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
export function LeaderBoardLiveActionCell(
  { row },
  setSelectedRow,
  setOpenModal,
  declareWinner,
  checkRank,
  addEditPricePanel,
  type,
) {
  const { original } = row;

  const navigate = useNavigate();

  console.log({ type });

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {addEditPricePanel ? (
            <button
              onClick={() =>
                navigate(`${routes.series.prizeCard}?series-id=${original.id}`)
              }
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <span>Add/Edit Price Panel</span>
            </button>
          ) : (
            ""
          )}

          {checkRank ? (
            <button
              onClick={() =>
                navigate(
                  `${routes.series.leaderBoard.checkRank}?series-id=${original.id}&type=${type}`,
                )
              }
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <span>Check Rank</span>
            </button>
          ) : (
            ""
          )}

          {declareWinner ? (
            <button
              onClick={() => {
                setSelectedRow(original);
                setOpenModal(true);
              }}
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <span>Declare Winner</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
export function AllContestActionCell({ row }) {
  const { original } = row;
  console.log({ original });
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          <button
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Disable automatch</span>
          </button>

          <>
            <hr className="border-gray-150 dark:border-dark-500 mx-3 my-1.5 h-px" />

            <button
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Price card</span>
            </button>
          </>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function YesNoCell({ getValue }) {
  if (getValue()) {
    return <p className="text-green-600"> Yes </p>;
  }
  return <p className="text-red-600">No </p>;
}

export function ContestUserDetailsActionCell(
  { row },
  type,
  matchId,
  contestId,
) {
  const navigate = useNavigate();

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          <button
            onClick={() =>
              navigate(
                `${BASE_PATH}/matches/view-all-matches/${type}/all-contest/contest-user-detail/team?matchId=${matchId}&contestId=${contestId}&teamId=${row.original.teamId}`,
              )
            }
            className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
          >
            <EyeIcon className="mr-1 h-4 w-4" />
            <span>View Team</span>
          </button>
          <button
            onClick={() =>
              navigate(
                `${routes.userTransactions.userTrasaction}?userId=${row.original.userId}`,
              )
            }
            className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
          >
            <BanknotesIcon className="mr-1 h-4 w-4" />
            <span>View Transaction</span>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function MatchWiseResultActionCell(
  { row },
  getMatchData,
  type,
  selectedFantasyType,
) {
  const { original } = row;

  // const updateFantasyPointHandler = async () => {
  //   try {
  //     const res = await axiosInstance.get(
  //       `${UPDATE_FANTASY_POINT}?real_matchkey=${original.real_matchkey}&matchkey=${original._id}`,
  //     );

  //     if (res.data.success) {
  //       await getMatchData();
  //       toast.success(res.data.message);
  //     }
  //   } catch (error) {
  //     if (error.status === 401) {
  //       toast.message("No innings data available")
  //       window.location.reload();

  //     }
  const updateFantasyPointHandler = async () => {
    try {
      toast.promise(
        // axiosInstance.patch(
        //   `${UPDATE_FANTASY_POINT}?real_matchkey=${original.real_matchkey}&matchkey=${original._id}`
        // ),
      );

      // if (res.data.success) {
      //   await getMatchData();
      //   toast.success(res.data.message);
      // }
      toast.error("Endpoint no longer exists");
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("STATUS:", error?.response?.status);
      console.log("MESSAGE:", error?.response?.data);

      if (error?.response?.status === 401) {
        toast.error("No innings data available");
        window.location.reload();
      }
      if (error?.response?.data?.message?.includes("inning")) {
        toast.error("No inning available");
        return;
      }

      toast.error("Something went wrong!");
    }
  };

  const cancelMatch = async (id) => {
    try {
      toast.promise(
        // axiosInstance.patch(
        //   `${CANCEL_MATCH}?matchkey=${original._id}&status=IsCanceled`,
        // ),
      );
      // if (res.data.success) {
      //   toast.success(res.data.message);
      //   getMatchData();
      // }
      toast.error("Endpoint no longer exists");
    } catch (error) {
      if (error.status === 401) {
        window.location.reload();
      }
      console.log({ error });
      toast.error(error.response.data.message);
    }
  };

  const abandon = async (id) => {
    try {
      toast.promise(
        // axiosInstance.patch(
        //   `${CANCEL_MATCH}?matchkey=${original._id}&status=IsAbandoned`,
        // ),
      );
      // if (res.data.success) {
      //   toast.success(res.data.message);
      //   getMatchData();
      // }
      toast.error("Endpoint no longer exists");
    } catch (error) {
      if (error.status === 401) {
        window.location.reload();
      }
      console.log({ error });
      toast.error(error.response.data.message);
    }
  };
  const navigate = useNavigate();
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          <button
            onClick={() => updateFantasyPointHandler()}
            className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
          >
            <span>Update Fantasy Point</span>
          </button>

          <button
            onClick={() =>
              navigate(
                `${BASE_PATH}/result-manager/match-result/${type}/contest?id=${original._id}&type=${type}&fantasy_type=${selectedFantasyType.name}`,
              )
            }
            className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
          >
            <span>Winner Declared</span>
          </button>

          <button
            onClick={abandon}
            className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
          >
            <span>Abandon</span>
          </button>

          <button
            onClick={cancelMatch}
            className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
          >
            <span>Canceled</span>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function VarificationCell({ row }) {
  const statusIcons = {
    verified: (
      <FaCheckCircle className="absolute -top-2 -right-2 text-lg text-green-500" />
    ),
    unverified: (
      <FaTimesCircle className="absolute -top-2 -right-2 text-lg text-red-500" />
    ),
  };

  const verificationItems = [
    {
      label: "Mobile",
      icon: <MdPhoneIphone className="text-lg text-primary" />,
      status:
        row.original.verificationStatus.mobile === 1
          ? "verified"
          : "unverified",
    },
    {
      label: "Email",
      icon: <MdEmail className="text-lg text-primary" />,
      status:
        row.original.verificationStatus.email === 1 ? "verified" : "unverified",
    },
    {
      label: "PAN",
      icon: <MdPerson className="text-lg text-primary" />,
      status:
        row.original.verificationStatus.pan === 1 ? "verified" : "unverified",
    },
    {
      label: "Aadhaar",
      icon: <MdCreditCard className="text-lg text-primary" />,
      status:
        row.original.verificationStatus.aadhar === 1
          ? "verified"
          : "unverified",
    },
    {
      label: "Bank",
      icon: <MdAccountBalance className="text-lg text-primary" />,
      status:
        row.original.verificationStatus.bank === 1 ? "verified" : "unverified",
    },
  ];

  return (
    <div className="flex space-x-4 p-2 pl-0">
      {verificationItems.map((item, index) => (
        <div key={index} className="group relative">
          <div className="rounded-full bg-primary-100 p-3">{item.icon}</div>
          {statusIcons[item.status]}

          {/* Tooltip */}
          <div className="absolute bottom-[-2rem] left-1/2 z-10 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
            {`${item.label} - ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RegisterUsersActionCell(
  { row },
  setSelectedRow,
  getAllRegisterUsers,
) {
  const { original } = row;
  const navigate = useNavigate();
  const userWithdrawStatusHandler = async () => {
    try {
      toast.promise(
        // axiosInstance.patch(
        //   `${SET_USER_WITHDRAWAL_STATUS}?id=${original._id}`,
        // ),
      );

      // if (res.data.success) {
      //   await getAllRegisterUsers();
      //   toast.success(res.data.message);
      // }
      toast.error("Endpoint no longer exists");
    } catch (error) {
      console.log(error);
    }
  };



  // const userPromoterStatusHandler = async () => {
  //   try {
  //     const { _id, action } = selectedRow; // action = 1 or -1

  //     const res = await axiosInstance.post(
  //       `${SET_USER_PROMOTER_STATUS}/${_id}`,
  //       { action } // send action 1 (make) or -1 (remove)
  //     );

  //     if (res.data.success) {
  //       await getAllRegisterUsers();
  //       toast.success(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong!");
  //   }
  // };

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          <button
            onClick={() =>
              navigate(
                `${routes.userManager.viewUserDetail}?userId=${original?._id}`,
              )
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>View User Detail</span>
          </button>

          <button
            onClick={() =>
              navigate(
                `${routes.userTransactions.userTrasaction}?userId=${original._id}`,
              )
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>User Transactions</span>
          </button>
          <button
            onClick={() => setSelectedRow({ ...original, action: "block" })}
            className={`dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide ${original.status === "activated" ? "text-red-600" : "text-green-600"} transition-colors outline-none hover:bg-gray-100`}
          >
            <span>{original.status === "activated" ? "Block" : "Unblock"}</span>
          </button>

          <button
            onClick={() => setSelectedRow({ ...original, action: 1 })}
            className={`dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide ${original.promoter_verify === 1 ? "text-red-600" : "text-green-600"} transition-colors outline-none hover:bg-gray-100`}
          >
            <span>{original.promoter_verify === -1 ? "Make Promoter" : "Remove Promoter"}</span>
          </button>

          <button
            onClick={() =>
              navigate(
                `${routes.userManager.userRefferals}?userId=${original?._id}`,
              )
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Promotor Transaction</span>
          </button>

          <button
            onClick={() =>
              setSelectedRow({ ...original, action: "editReferCode" })
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Edit Refer Code</span>
          </button>

          <button
            onClick={() =>
              setSelectedRow({ ...original, action: "makeGuru" })
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Make Guru</span>
          </button>

          <button
            onClick={() =>
              setSelectedRow({ ...original, action: "withdrawLimit" })
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Set Withdrawal Limit</span>
          </button>
          <button
            onClick={() => userWithdrawStatusHandler()}
            className={`dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide ${original?.withdrawals ? "text-red-600" : "text-green-600"} transition-colors outline-none hover:bg-gray-100`}
          >
            <span>
              {original?.withdrawals
                ? "Disable Withdrawals"
                : "Enable Withdrawals"}
            </span>
          </button>
          <button
            onClick={() =>
              setSelectedRow({ ...original, action: "updateBankDetails" })
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-blue-600 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Update Bank Details</span>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function AdminWalletActionCell(
  { row },
  setModalOpen,
  setSelectedModal,
  addMoneyPermssion,
  deductMoneyPermssion,
) {
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {addMoneyPermssion ? (
            <button
              onClick={() => {
                setSelectedModal("addMoney");
                setModalOpen(true);
              }}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Add Money</span>
            </button>
          ) : (
            ""
          )}

          {deductMoneyPermssion ? (
            <button
              onClick={() => {
                setSelectedModal("deductMoney");
                setModalOpen(true);
              }}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Deduct Money</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function ViewLevelsActionCell(
  { row },
  setSelectedRow,
  setSelectedEditRow,
  permissions,
) {
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {permissions?.actions?.edit ? (
            <button
              onClick={() => setSelectedEditRow(row.original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Edit</span>
            </button>
          ) : (
            ""
          )}

          {permissions?.actions?.delete ? (
            <button
              onClick={() => setSelectedRow(row.original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-red-700 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Delete</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function ViewStoryActionCell(
  { row },
  setSelectedRow,
  setSelectedEditRow,
  permissions,
) {
  const { original } = row;
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {permissions?.actions?.edit ? (
            <button
              onClick={() => setSelectedEditRow(original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center gap-2 px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <MdEdit className="text-primary-800 size-4" />
              <span>Edit</span>
            </button>
          ) : (
            ""
          )}

          {permissions?.actions?.delete ? (
            <button
              onClick={() => setSelectedRow(original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center gap-2 px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <MdDelete className="size-4 text-red-600" />
              <span>Delete</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function ViewInvestorContestActionCell(
  { row },
  setSelectedRow,
  setSelectedEditRow,
  activeInactiveHandler,
  winnerDeclareHandler,
  type,
  permissions,
) {
  const navigate = useNavigate();

  const activePermmission = permissions?.items?.find((obj) => {
    return obj.name === "Active/Inactive";
  });

  const prizeCardPermmission = permissions?.items?.find((obj) => {
    return obj.name === "Price Card";
  });

  const viewUsersPermmission = permissions?.items?.find((obj) => {
    return obj.name === "View Users";
  });

  const winnerDeclarePermmission = permissions?.items?.find((obj) => {
    return obj.name === "Winner Declare";
  });
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {permissions?.actions?.edit && type === "live" ? (
            <button
              onClick={() => setSelectedEditRow(row.original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Edit</span>
            </button>
          ) : (
            ""
          )}
          {activePermmission && type === "live" ? (
            <button
              onClick={() => activeInactiveHandler(row.original._id)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>{row.original.is_active ? "In Active" : "Active"}</span>
            </button>
          ) : (
            ""
          )}

          {permissions?.actions?.delete && type === "live" ? (
            <button
              onClick={() => setSelectedRow(row.original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-red-700 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Delete</span>
            </button>
          ) : (
            ""
          )}

          {prizeCardPermmission && type === "live" ? (
            <button
              onClick={() =>
                navigate(
                  `/investor-manager/view-investor-contest/${type}/prize-card?series-id=${row.original._id}`,
                )
              }
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Price Card</span>
            </button>
          ) : (
            ""
          )}

          {viewUsersPermmission &&
            (type === "live" ||
              type === "winner-declare-required" ||
              type === "winner-declared") ? (
            <button
              onClick={() =>
                navigate(
                  `/investor-manager/view-investor-contest/${type}/users?start_date=${row.original.startData}&end_date=${row.original.endData}`,
                )
              }
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>View Users</span>
            </button>
          ) : (
            ""
          )}

          {winnerDeclarePermmission &&
            (type === "live" || type === "winner-declare-required") ? (
            <button
              onClick={() => winnerDeclareHandler(row.original._id)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-green-700 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Winner Declare</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function OffersStatusCell(
  { row },
  setSelectedEditRow,
  setSelectedDeleteRow,
  permissions,
) {
  const { original } = row;

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {permissions?.actions?.edit ? (
            <button
              onClick={() => setSelectedEditRow(row.original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <PencilIcon className="mr-2 h-5 w-5" />
              <span>Edit</span>
            </button>
          ) : (
            ""
          )}
          {permissions?.actions?.delete ? (
            <button
              onClick={() => setSelectedDeleteRow(row.original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-red-600 transition-colors outline-none hover:bg-red-100"
              }
            >
              <TrashIcon className="mr-2 h-5 w-5" />
              <span>Delete</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function AllfundsActionCell({ row }) {
  const navigate = useNavigate();

  const { original } = row;
  console.log({ original });
  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {original?.totalSuccessAmount > 0 ? (
            <button
              onClick={() =>
                navigate(
                  `${routes.receiveFundManager.allReceiveFundUsers}?date=${dayjs(original.date).format("D-MMMM-YYYY")}&status=success`,
                )
              }
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <span> Success Transactions</span>
            </button>
          ) : (
            ""
          )}

          {original.totalPendingAmount > 0 ? (
            <button
              onClick={() =>
                navigate(
                  `${routes.receiveFundManager.allReceiveFundUsers}?date=${dayjs(original.date).format("D-MMMM-YYYY")}&status=pending`,
                )
              }
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <span>Pending Transactons</span>
            </button>
          ) : (
            ""
          )}

          {original?.totalFailedAmount > 0 ? (
            <button
              onClick={() =>
                navigate(
                  `${routes.receiveFundManager.allReceiveFundUsers}?date=${dayjs(original.date).format("D-MMMM-YYYY")}&status=failed`,
                )
              }
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <span>Failed Transactons</span>
            </button>
          ) : (
            ""
          )}

          {original?.totalAbortedAmount > 0 ? (
            <button
              onClick={() =>
                navigate(
                  `${routes.receiveFundManager.allReceiveFundUsers}?date=${dayjs(original.date).format("D-MMMM-YYYY")}&status=aborted`,
                )
              }
              className="dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            >
              <span> Aborted Transactons</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function PromoterStatusCell(
  { row },
  type,
  permissions,
  setSelectedRow,
  setSelectedEditRow,
  setSelectedRejectRow,
) {
  const navigate = useNavigate();
  const { original } = row;
  const items = permissions?.items || [];
  const editPermission = items.find((obj) => {
    return obj.id === `promoter-manager-view-promoter-${type}-edit-promoter`;
  });
  const rejectPermission = items.find((obj) => {
    return obj.id === `promoter-manager-view-promoter-${type}-reject`;
  });

  const viewIncomPermission = items.find((obj) => {
    return obj.id === `promoter-manager-view-promoter-${type}-view-income`;
  });

  const banUnbanPermission = items.find((obj) => {
    return obj.id === `promoter-manager-view-promoter-${type}-ban-unban`;
  });

  const approvedPermission = items.find((obj) => {
    return obj.id === `promoter-manager-view-promoter-${type}-approved`;
  });

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          {type === "pending" && approvedPermission ? (
            <button
              onClick={() => setSelectedEditRow(original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Approved</span>
            </button>
          ) : editPermission ? (
            <button
              onClick={() => setSelectedEditRow(original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>Edit</span>
            </button>
          ) : (
            ""
          )}
          {viewIncomPermission ? (
            <button
              onClick={() =>
                navigate(
                  `/promoter-manager/view-promoter/${type}/view-income?promoterId=${original._id}`,
                )
              }
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>View Income</span>
            </button>
          ) : (
            ""
          )}

          {viewIncomPermission ? (
            <button
              onClick={() =>
                navigate(
                  `/promoter-manager/view-promoter/${type}/view-withdrawals?promoterId=${original._id}`,
                )
              }
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
              }
            >
              <span>View Withdrawals</span>
            </button>
          ) : (
            ""
          )}

          {rejectPermission ? (
            <button
              onClick={() => setSelectedRejectRow(original)}
              className={
                "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-red-600 transition-colors outline-none hover:bg-red-100"
              }
            >
              <span>Reject</span>
            </button>
          ) : (
            ""
          )}

          {banUnbanPermission ? (
            <button
              onClick={() => setSelectedRow(original)}
              className={`dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide ${original.status === 0 ? "text-green-400" : "text-red-600"} transition-colors outline-none hover:bg-red-100`}
            >
              <span>{original.status === 0 ? "Unban" : "Ban"}</span>
            </button>
          ) : (
            ""
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function PromoterIncomeCell({ row }, type) {
  const navigate = useNavigate();
  const { original } = row;

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          <button
            onClick={() =>
              navigate(
                `/promoter-manager/view-promoter/${type}/view-income/matches?promoterId=${original.id}`,
              )
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Total Matches</span>
          </button>
          <button
            onClick={() =>
              navigate(
                `/promoter-manager/view-promoter/${type}/view-income/deposite-refered-users?promoter_id=${original.id}`,
              )
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span> Refered Users</span>
          </button>
          <button
            onClick={() =>
              navigate(
                `/promoter-manager/view-promoter/${type}/view-income/total-withdraws?promoterUserId=${original.promoterUserId}`,
              )
            }
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-gray-800 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Total Withdraws</span>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export function ReviewWithdrawsCell({ row }) {
  const navigate = useNavigate();

  return (
    <Popover className="relative inline-block text-left">
      <PopoverButton
        as={Button}
        variant="flat"
        className="size-8 shrink-0 rounded-full p-0"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="dark:border-dark-500 dark:bg-dark-700 absolute right-0 z-[100] mt-1.5 flex !max-w-[12rem] min-w-[10rem] -translate-x-6 flex-col rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:shadow-none"
      >
        <div className="flex flex-col">
          <button
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-green-600 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Accept</span>
          </button>
          <button
            className={
              "dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 flex h-9 w-full cursor-pointer items-center px-3 tracking-wide text-red-600 transition-colors outline-none hover:bg-gray-100"
            }
          >
            <span>Reject</span>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
