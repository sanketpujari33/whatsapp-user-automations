import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button, Input, Spinner } from "components/ui";
import { toast } from "sonner";
import axiosInstance from 'utils/network/axiosInstance';
import { GET_USER_DETAILS } from "constants/apiendpoints";

export const UpdateBankDetailsModal = ({
  show,
  onClose,
  selectedRow,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [formData, setFormData] = useState({
    accno: "",
    confirm_accno: "",
    ifsc: "",
    accountholder: "",
    bankName: "",
    city: "",
    state: "",
    type: "savings",
    comment: "Updated bank details",
  });

  // Fetch user details and populate form with existing bank data when modal opens
  useEffect(() => {
    if (show && selectedRow?._id) {
      fetchUserDetails();
    } else if (!show) {
      // Reset form when modal closes
      setFormData({
        accno: "",
        confirm_accno: "",
        ifsc: "",
        accountholder: "",
        bankName: "",
        city: "",
        state: "",
        type: "savings",
        comment: "Updated bank details",
      });
    }
  }, [show, selectedRow?._id]);

  const fetchUserDetails = async () => {
    try {
      setFetchingData(true);
      const res = await axiosInstance.get(GET_USER_DETAILS(selectedRow._id));

      if (res.data.success) {
        const bank = res.data.data?.bankDetails;
        const userDetails = res.data.data?.userDetails;

        if (bank) {
          setFormData({
            accno: bank.accno || "",
            confirm_accno: bank.accno || "",
            ifsc: bank.ifsc || "",
            accountholder: bank.accountholder || "",
            bankName: bank.bankname || "",
            city: bank.city || "",
            state: userDetails?.state || bank.state || "",
            type: bank.type || "savings",
            comment: "Updated bank details",
          });
        } else {
          // If no bank details found, reset to empty
          setFormData({
            accno: "",
            confirm_accno: "",
            ifsc: "",
            accountholder: "",
            bankName: "",
            city: "",
            state: userDetails?.state || "",
            type: "savings",
            comment: "Updated bank details",
          });
        }
      } else {
        // If API call fails, reset to empty
        setFormData({
          accno: "",
          confirm_accno: "",
          ifsc: "",
          accountholder: "",
          bankName: "",
          city: "",
          state: "",
          type: "savings",
          comment: "Updated bank details",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load bank details");
      setFormData({
        accno: "",
        confirm_accno: "",
        ifsc: "",
        accountholder: "",
        bankName: "",
        city: "",
        state: "",
        type: "savings",
        comment: "Updated bank details",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.accno.trim()) {
      toast.error("Please enter account number");
      return;
    }
    if (!formData.confirm_accno.trim()) {
      toast.error("Please confirm account number");
      return;
    }
    if (formData.accno !== formData.confirm_accno) {
      toast.error("Account numbers do not match");
      return;
    }
    if (!formData.ifsc.trim()) {
      toast.error("Please enter IFSC code");
      return;
    }
    if (!formData.accountholder.trim()) {
      toast.error("Please enter account holder name");
      return;
    }
    if (!formData.bankName.trim()) {
      toast.error("Please enter bank name");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter city");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userid: selectedRow._id,
        accno: formData.accno,
        confirm_accno: formData.confirm_accno,
        ifsc: formData.ifsc,
        accountholder: formData.accountholder,
        bankName: formData.bankName,
        city: formData.city,
        state: formData.state,
        type: formData.type,
        comment: formData.comment,
      };

      // const res = await axiosInstance.post(UPDATE_USER_BANK_DETAILS, payload);

      // if (res.data.success) {
      //   toast.success(res.data.message || "Bank details updated successfully");
      //   setFormData({
      //     accno: "",
      //     confirm_accno: "",
      //     ifsc: "",
      //     accountholder: "",
      //     bankName: "",
      //     city: "",
      //     state: "",
      //     type: "savings",
      //     comment: "Updated bank details",
      //   });
      //   onClose();
      //   if (onSuccess) onSuccess();
      // }
      toast.error("Endpoint no longer exists");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update bank details";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="dark:bg-dark-700 w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="dark:text-dark-100 text-lg font-medium leading-6 text-gray-900"
                >
                  Update Bank Details
                </Dialog.Title>

                {fetchingData ? (
                  <div className="mt-4 flex justify-center py-8">
                    <Spinner color="primary" className="size-8 border-4" />
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <Input
                      type="text"
                      name="accno"
                      value={formData.accno}
                      onChange={handleInputChange}
                      placeholder="Enter account number"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      Confirm Account Number
                    </label>
                    <Input
                      type="text"
                      name="confirm_accno"
                      value={formData.confirm_accno}
                      onChange={handleInputChange}
                      placeholder="Confirm account number"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <Input
                      type="text"
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleInputChange}
                      placeholder="Enter IFSC code"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <Input
                      type="text"
                      name="accountholder"
                      value={formData.accountholder}
                      onChange={handleInputChange}
                      placeholder="Enter account holder name"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <Input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                    >
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="dark:text-dark-200 block text-sm font-medium text-gray-700">
                      Comment (Optional)
                    </label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      placeholder="Add any comment"
                      disabled={loading}
                      rows="3"
                      className="dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      type="button"
                      variant="flat"
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <Spinner size="sm" className="mr-2" />
                      ) : null}
                      Update Bank Details
                    </Button>
                  </div>
                </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
