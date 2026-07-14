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
import { workerApi } from "../../api";
import { API_STATUS } from "../../constants";
import { toast } from "react-hot-toast";

const EMPTY_FORM = { name: "", esiNumber: "", pfNumber: "", mobileNumber: "" };

const Workers = () => {
  const { data, status, error, execute } = useApi(workerApi.getAll);
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

  const workers = data?.data?.workers || [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (worker) => {
    setEditing(worker);
    setForm({
      name: worker.name || "",
      esiNumber: worker.esiNumber || "",
      pfNumber: worker.pfNumber || "",
      mobileNumber: worker.mobileNumber || "",
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
    if (!form.esiNumber || !form.esiNumber.trim()) {
      next.esiNumber = "ESI number is required";
    }
    if (!form.pfNumber || !form.pfNumber.trim()) {
      next.pfNumber = "PF number is required";
    }
    if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) {
      next.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await workerApi.update(editing._id, form);
        toast.success("Worker updated successfully");
      } else {
        await workerApi.create(form);
        toast.success("Worker added successfully");
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
    await workerApi.delete(deleteTarget._id);
    toast.success("Worker deleted successfully");
    setDeleteTarget(null);
    execute();
    refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete worker");
    }
  };

  const workerColumns = [
    { key: "name", label: "Name" },
    { key: "mobileNumber", label: "Mobile" },
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
    { key: "createdAt", label: "Join Date" },
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
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Workers</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Manage all workers</p>
        </div>
        <Button onClick={openCreate}>
          Add Worker
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search workers..." />
        </div>
        <Table
          columns={workerColumns}
          data={workers}
          isLoading={status === API_STATUS.LOADING}
          emptyMessage="No workers found"
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Worker" : "Add Worker"} footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button type="submit" form="worker-form" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</Button>
        </div>
      }>
        <form id="worker-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter worker name"
            />
          </div>
          <Input
            label="ESI Number"
            name="esiNumber"
            value={form.esiNumber}
            onChange={handleChange}
            error={errors.esiNumber}
            placeholder="Enter ESI number"
          />
          <Input
            label="PF Number"
            name="pfNumber"
            value={form.pfNumber}
            onChange={handleChange}
            error={errors.pfNumber}
            placeholder="Enter PF number"
          />
          <div className="lg:col-span-2">
            <Input
              label="Mobile Number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              error={errors.mobileNumber}
              placeholder="10-digit mobile number"
            />
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Worker"
        message="Are you sure you want to delete this worker? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Workers;
