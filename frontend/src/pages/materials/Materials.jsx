import { useEffect, useState } from "react";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { Modal } from "../../components/modals";
import { ConfirmationDialog } from "../../components/modals";
import { Input } from "../../components/forms";
import { Button } from "../../components/buttons";
import { useApi } from "../../hooks/useApi";
import { useDataRefresh } from "../../context/DataRefreshContext";
import { materialApi } from "../../api";
import { API_STATUS } from "../../constants";
import { toast } from "react-hot-toast";

const UNITS = ["kg", "liter", "piece", "bag", "meter", "sqft", "cubic_feet", "ton", "dozen", "other"];

const EMPTY_FORM = { name: "", unitPrice: "", unit: "piece", note: "" };

const Materials = () => {
  const { data, status, error, execute } = useApi(materialApi.getAll);
  const { refresh } = useDataRefresh();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    execute();
  }, [execute]);

  const materials = data?.data?.materials || [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (material) => {
    setEditing(material);
    setForm({
      name: material.name || "",
      unitPrice: material.unitPrice ?? "",
      unit: material.unit || "piece",
      note: material.note || "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name || form.name.trim().length < 2) {
      next.name = "Name must be at least 2 characters";
    }
    if (form.unitPrice === "" || isNaN(Number(form.unitPrice)) || Number(form.unitPrice) < 0) {
      next.unitPrice = "Enter a valid unit price";
    }
    if (!form.unit) {
      next.unit = "Unit is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, unitPrice: Number(form.unitPrice) };
      if (editing) {
        await materialApi.update(editing._id, payload);
        toast.success("Material updated successfully");
      } else {
        await materialApi.create(payload);
        toast.success("Material added successfully");
      }
      setIsModalOpen(false);
      execute();
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
    await materialApi.delete(deleteTarget._id);
    toast.success("Material deleted successfully");
    setDeleteTarget(null);
    execute();
    refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete material");
    }
  };

  const materialColumns = [
    { key: "name", label: "Name" },
    { key: "unitPrice", label: "Unit Price", render: (value) => `₹${value}` },
    { key: "unit", label: "Unit" },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === true
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Materials</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Manage construction materials</p>
        </div>
        <Button onClick={openCreate}>
          Add Material
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search materials..." />
        </div>
        <Table
          columns={materialColumns}
          data={materials}
          isLoading={status === API_STATUS.LOADING}
          emptyMessage="No materials found"
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Material" : "Add Material"} footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button type="submit" form="material-form" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</Button>
        </div>
      }>
        <form id="material-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter material name"
            />
          </div>
          <Input
            label="Unit Price"
            name="unitPrice"
            type="number"
            value={form.unitPrice}
            onChange={handleChange}
            error={errors.unitPrice}
            placeholder="Enter unit price"
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            {errors.unit && <span className="text-xs text-red-500">{errors.unit}</span>}
          </div>
          <div className="lg:col-span-2">
            <Input
              label="Note (optional)"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Enter note"
            />
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Material"
        message="Are you sure you want to delete this material? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Materials;
