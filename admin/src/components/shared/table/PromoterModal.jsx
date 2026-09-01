import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";

export const PromoterModal = ({ show, onClose, onOk, selectedRow }) => {
  const [percentage, setPercentage] = useState("");
  const [customReferCode, setCustomReferCode] = useState("");

  const isPromoter = selectedRow?.promoter_verify === 1;

useEffect(() => {
  if (show && selectedRow) {
  
    setPercentage(selectedRow.percentage ?? "");
    setCustomReferCode(selectedRow.refer_code ?? "");
  }
}, [show, selectedRow]);


  const handleOk = () => {
    const body = {
      status: isPromoter ? -1 : 1,
      percentage: Number(percentage) || 0,
      custom_refer_code: customReferCode.trim(),
    };
    onOk(body);
  };

  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-dark-700">
              
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-dark-50">
                  {isPromoter ? "Remove Promoter?" : "Make Promoter?"}
                </Dialog.Title>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-dark-100">
                {isPromoter
                  ? "Are you sure you want to remove this user from promoter status?"
                  : "Are you sure you want to make this user a promoter?"}
              </p>

              {!isPromoter && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
                    Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="Enter percentage"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                      dark:bg-dark-600 dark:border-dark-500 dark:text-dark-50"
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1 mt-3">
                    Custom Refer Code
                  </label>
                  <input
                    type="text"
                    value={customReferCode}
                    onChange={(e) => setCustomReferCode(e.target.value.replace(/\s/g, '').toUpperCase())}
                    placeholder="Enter custom refer code (no spaces)"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                      dark:bg-dark-600 dark:border-dark-500 dark:text-dark-50"
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-200 mt-1">
                    Leave empty to keep existing code or auto-generate one
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="flat" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleOk}
                  color="primary"
                  disabled={!isPromoter && !percentage}
                >
                  {isPromoter ? "Remove" : "Make Promoter"}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
