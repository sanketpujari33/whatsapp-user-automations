import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";

export const EditReferCodeModal = ({ show, onClose, onOk, selectedRow, loading = false }) => {
  const [referCode, setReferCode] = useState("");

  useEffect(() => {
    if (show && selectedRow) {
      setReferCode(selectedRow.refer_code ?? "");
    }
  }, [show, selectedRow]);

  const handleOk = () => {
    if (!referCode.trim()) {
      return;
    }
    
    const body = {
      refer_code: referCode.trim().toUpperCase(),
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
                  Edit Refer Code
                </Dialog.Title>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-dark-100">
                Update the refer code for user <span className="font-medium">{selectedRow?.username || selectedRow?.team}</span>
              </p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-100 mb-1">
                  Refer Code
                </label>
                <input
                  type="text"
                  value={referCode}
                  onChange={(e) => setReferCode(e.target.value.replace(/\s/g, '').toUpperCase())}
                  placeholder="Enter refer code (no spaces)"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    dark:bg-dark-600 dark:border-dark-500 dark:text-dark-50"
                />
                <p className="text-xs text-gray-500 dark:text-dark-200 mt-1">
                  Spaces will be removed automatically and code will be converted to uppercase
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="flat" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleOk}
                  color="primary"
                  disabled={!referCode.trim() || loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
