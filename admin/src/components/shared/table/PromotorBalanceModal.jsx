import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Input, Button } from "components/ui";
import { toast } from "sonner";

export const PromotorBalanceModal = ({
  show,
  onClose,
  user,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show || !user) return null;

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    await onSubmit({
      userid: user._id,
      amount: Number(amount),
    });
    setLoading(false);
    setAmount("");
  };

  return (
    <Dialog open={show} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <DialogTitle className="text-lg font-semibold mb-4">
            Make Promoter Payment
          </DialogTitle>

          <div className="space-y-4">
            {/* <div>
              <label className="text-sm text-gray-600">User ID</label>
              <Input value={user._id} disabled />
            </div> */}

            <div>
              <label className="text-sm text-gray-600">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
