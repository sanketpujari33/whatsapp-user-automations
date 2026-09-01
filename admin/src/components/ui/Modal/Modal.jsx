import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import clsx from "clsx";

export function Modal({ isOpen, onClose, onRequestClose, title, children, className, size }) {
  const focusRef = useRef();
  const handleClose = onClose || onRequestClose || (() => {});

  const sizeClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[size] || "sm:max-w-lg";

  if (!isOpen) return null;

  return (
    <Transition
      appear
      show={isOpen}
      as={Dialog}
      initialFocus={focusRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      onClose={handleClose}
    >
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40"
      />

      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className={clsx(
          "scrollbar-sm dark:bg-dark-700 relative flex w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg",
          sizeClass,
          className
        )}
      >
        <div className="dark:bg-dark-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Dialog.Title
              as="h3"
              className="dark:text-dark-100 text-lg font-semibold leading-6 text-gray-900"
            >
              {title}
            </Dialog.Title>
            <button
              type="button"
              className="dark:text-dark-400 dark:hover:text-dark-200 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="dark:bg-dark-700 px-4 pb-6 pt-5 sm:px-6 sm:pb-6 bg-white">
          {children}
        </div>
      </TransitionChild>
    </Transition>
  );
}