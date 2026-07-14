import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components/forms";
import { Button } from "../../components/buttons";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import { siteApi, materialRequestApi } from "../../api";
import { toast } from "react-hot-toast";

const MaterialRequest = () => {
  const materialsHook = useApi(siteApi.materials);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    materialsHook.execute();
  }, [materialsHook.execute]);

  const materials = Array.isArray(materialsHook.data?.data) ? materialsHook.data.data : [];
  const selected = materials.find((m) => m._id === selectedMaterialId);

  const grandTotal = cart.reduce((sum, m) => sum + (m.quantity * m.price), 0);

  const handleAddMaterial = () => {
    if (!selected) {
      toast.error("Please select a material");
      return;
    }
    if (!quantity || parseInt(quantity) < 1) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (cart.some((item) => item.materialId === selected._id)) {
      toast.error("This material has already been added.");
      return;
    }
    const newItem = {
      materialId: selected._id,
      name: selected.name,
      quantity: parseInt(quantity),
      unit: selected.unit,
      price: selected.unitPrice,
    };
    setCart((prev) => [...prev, newItem]);
    setSelectedMaterialId("");
    setQuantity("");
  };

  const handleRemove = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Please add at least one material");
      return;
    }
    setIsSubmitting(true);
    try {
      await materialRequestApi.submit({
        materials: cart.map((m) => ({
          materialId: m.materialId,
          name: m.name,
          quantity: m.quantity,
          unit: m.unit,
          price: m.price,
        })),
        note,
      });
      toast.success("Material request submitted successfully!");
      setCart([]);
      setNote("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartColumns = [
    { key: "name", label: "Material Name" },
    {
      key: "quantity",
      label: "Quantity",
      render: (value) => value ?? 0,
    },
    { key: "unit", label: "Unit" },
    {
      key: "price",
      label: "Price",
      render: (value) => `₹${value}`,
    },
    {
      key: "total",
      label: "Total",
      render: (_, row) => `₹${(row.quantity * row.price).toFixed(2)}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={() => handleRemove(row._index)}
          className="text-xs font-medium px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-theme"
        >
          Remove
        </button>
      ),
    },
  ];

  const cartRows = cart.map((m, idx) => ({ ...m, _index: idx }));

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Material Request</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Request materials for site work</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Material
            </label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full px-4 py-3 sm:py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white min-h-[44px] sm:min-h-0"
            >
              <option value="">Select material</option>
              {materials.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Quantity"
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Unit (auto-filled)
            </label>
            <input
              type="text"
              value={selected ? selected.unit : ""}
              readOnly
              placeholder="Select a material"
              className="w-full px-4 py-3 sm:py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-secondary-100 dark:bg-secondary-700/50 text-secondary-900 dark:text-white min-h-[44px] sm:min-h-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Price per unit (auto-filled, read-only)
            </label>
            <input
              type="text"
              value={selected ? `₹${selected.unitPrice}` : ""}
              readOnly
              placeholder="Select a material"
              className="w-full px-4 py-3 sm:py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-secondary-100 dark:bg-secondary-700/50 text-secondary-900 dark:text-white min-h-[44px] sm:min-h-0"
            />
          </div>

          <div>
            <Button type="button" variant="secondary" onClick={handleAddMaterial} disabled={materialsHook.status === API_STATUS.LOADING}>
              Add Material
            </Button>
          </div>

          {cart.length > 0 && (
            <div>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Added Materials</p>
              <Table
                columns={cartColumns}
                data={cartRows}
                isLoading={false}
                emptyMessage="No materials added"
              />
              <div className="mt-3 text-right text-sm font-medium text-secondary-900 dark:text-white">
                Grand Total: ₹{grandTotal.toFixed(2)}
              </div>
            </div>
          )}

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
            disabled={isSubmitting || cart.length === 0 || materialsHook.status === API_STATUS.LOADING}
            className="w-full px-4 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-theme disabled:opacity-50 min-h-[44px] sm:min-h-0"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </motion.button>
        </form>
      </Card>
    </div>
  );
};

export default MaterialRequest;
