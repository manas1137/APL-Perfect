import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components/forms";
import { Card } from "../../components/cards";
import { paymentRequestApi } from "../../api";
import { toast } from "react-hot-toast";

const PaymentRequest = () => {
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) {
      toast.error("Purpose is required");
      return;
    }
    if (!amount || parseFloat(amount) < 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsSubmitting(true);
    try {
      await paymentRequestApi.submit({
        date: new Date().toISOString().split("T")[0],
        purpose,
        amount: parseFloat(amount),
        note,
      });
      toast.success("Payment request submitted successfully!");
      setPurpose("");
      setAmount("");
      setNote("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Payment Request</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Request payment for work completed</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Input
            label="Purpose / Reason"
            placeholder="Enter purpose (e.g. Salary, Bonus)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />

          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Input
            label="Note (Optional)"
            placeholder="Additional notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-theme disabled:opacity-50 min-h-[44px] sm:min-h-0"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </motion.button>
        </form>
      </Card>
    </div>
  );
};

export default PaymentRequest;
