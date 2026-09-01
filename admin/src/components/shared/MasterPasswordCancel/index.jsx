import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef, useState } from "react";

// Local Imports
import { Input } from "components/ui";
import { toast } from "sonner";

const MasterPasswordCancelContest = ({
  isOpen,
  close,
  onSubmit, // Dynamic callback function
  title = "Enter Master Password",
  isLoading = false
}) => {
  const saveRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    
    try {
      await onSubmit(password);
      setPassword(""); // Clear on success
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to authenticate master password");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={close}
        initialFocus={saveRef}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 [transform:translate3d(0,-1rem,0)]"
          enterTo="opacity-100 [transform:translate3d(0,0,0)]"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 [transform:translate3d(0,0,0)]"
          leaveTo="opacity-0 [transform:translate3d(0,-1rem,0)]"
        >
          <DialogPanel className="scrollbar-sm dark:bg-dark-700 relative flex w-full max-w-sm flex-col overflow-y-auto rounded-lg bg-white px-4 pb-4 transition-all duration-300 sm:px-5">
            <div className="flex items-center justify-between py-4">
              <DialogTitle
                as="h3"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </DialogTitle>
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                onClick={close}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mb-4">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-8 right-3 z-10 flex items-center p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                onClick={close}
              >
                Cancel
              </button>
              <button
                ref={saveRef}
                onClick={handleSubmit}
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700 rounded px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {isLoading ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default MasterPasswordCancelContest;
