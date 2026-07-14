import { useEffect, useState } from "react";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { Modal } from "../../components/modals";
import { ConfirmationDialog } from "../../components/modals";
import { DropdownMenu } from "../../components/common";
import { Input, WorkerMultiSelect } from "../../components/forms";
import { Button } from "../../components/buttons";
import { useApi } from "../../hooks/useApi";
import { useDataRefresh } from "../../context/DataRefreshContext";
import { useNavigate } from "react-router-dom";
import { siteApi } from "../../api";
import { API_STATUS } from "../../constants";
import { toast } from "react-hot-toast";

const EMPTY_FORM = {
  name: "",
  ownerName: "",
  ownerMobile: "",
  ownerEmail: "",
  budget: "",
  location: "",
  password: "",
  assignedWorkers: [],
};

const Sites = () => {
  const { data, status, error, execute } = useApi(siteApi.getAll);
  const { refresh } = useDataRefresh();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    execute();
  }, [execute]);

  const sites = data?.data?.sites || [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (site) => {
    setEditing(site);
    setForm({
      name: site.name || "",
      ownerName: site.ownerName || "",
      ownerMobile: site.ownerMobile || "",
      ownerEmail: site.ownerEmail || "",
      budget: site.budget ?? "",
      location: site.location || "",
      password: "",
      assignedWorkers: (site.assignedWorkers || [])
        .filter(Boolean)
        .map((w) => {
          if (typeof w === "string") {
            return { _id: w };
          }
          return {
            _id: w._id,
            name: w.name,
            mobileNumber: w.mobileNumber,
            isActive: w.isActive,
          };
        }),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleWorkersChange = (workers) => {
    setForm((prev) => ({ ...prev, assignedWorkers: workers }));
    if (errors.assignedWorkers) setErrors((prev) => ({ ...prev, assignedWorkers: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name || form.name.trim().length < 2) next.name = "Site name is required";
    if (!form.ownerName || form.ownerName.trim().length < 2) next.ownerName = "Owner name is required";
    if (!/^[6-9]\d{9}$/.test(form.ownerMobile)) next.ownerMobile = "Enter a valid 10-digit mobile number";
    if (form.ownerEmail && !/^\S+@\S+\.\S+$/.test(form.ownerEmail)) next.ownerEmail = "Enter a valid email";
    if (form.budget === "" || isNaN(Number(form.budget)) || Number(form.budget) < 0) next.budget = "Enter a valid budget";
    if (!form.location || form.location.trim().length < 5) next.location = "Location must be at least 5 characters";
    if (!editing && (!form.password || form.password.length < 4)) next.password = "Site password must be at least 4 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        budget: Number(form.budget),
        assignedWorkers: (form.assignedWorkers || [])
          .filter(Boolean)
          .map((w) => (typeof w === "string" ? w : w._id))
          .filter(Boolean),
      };
      if (editing) {
        if (!form.password) delete payload.password;
        await siteApi.update(editing._id, payload);
        toast.success("Site updated successfully");
      } else {
        await siteApi.create(payload);
        toast.success("Site created successfully");
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
      await siteApi.delete(deleteTarget._id);
      toast.success("Site deleted successfully");
      setDeleteTarget(null);
      execute();
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete site");
    }
  };

  const siteColumns = [
    { key: "name", label: "Site Name" },
    { key: "location", label: "Location" },
    { key: "budget", label: "Budget", render: (value) => `₹${value}` },
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
        <DropdownMenu
          trigger={
            <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-theme">
              <span className="text-secondary-600 dark:text-secondary-400 text-lg leading-none">⋮</span>
            </button>
          }
          items={[
            {
              label: "View Site",
              icon: "👁",
              onClick: () => navigate(`/sites/${row._id}`),
            },
            {
              label: "Edit",
              icon: "✏️",
              onClick: () => openEdit(row),
            },
            {
              label: "Delete",
              icon: "🗑",
              danger: true,
              onClick: () => setDeleteTarget(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Sites</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Manage all construction sites</p>
        </div>
        <Button onClick={openCreate}>
          Add Site
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search sites..." />
        </div>
        <Table
          columns={siteColumns}
          data={sites}
          isLoading={status === API_STATUS.LOADING}
          emptyMessage="No sites found"
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Site" : "Add Site"} footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button type="submit" form="site-form" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</Button>
        </div>
      }>
        <form id="site-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <Input label="Site Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Enter site name" />
          </div>
          <Input label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} error={errors.ownerName} placeholder="Enter owner name" />
          <Input label="Owner Email (optional)" name="ownerEmail" value={form.ownerEmail} onChange={handleChange} error={errors.ownerEmail} placeholder="Enter email" />
          <Input label="Owner Mobile" name="ownerMobile" value={form.ownerMobile} onChange={handleChange} error={errors.ownerMobile} placeholder="10-digit mobile number" />
          <Input label="Budget" name="budget" type="number" value={form.budget} onChange={handleChange} error={errors.budget} placeholder="Enter budget" />
          <div className="lg:col-span-2">
            <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} placeholder="Enter location" />
          </div>
          <div className="lg:col-span-2">
            <WorkerMultiSelect
              selected={form.assignedWorkers}
              onChange={handleWorkersChange}
              error={errors.assignedWorkers}
            />
          </div>
          <div className="lg:col-span-2">
            <Input
              label={editing ? "Site Password (leave blank to keep)" : "Site Password"}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter site password"
            />
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Site"
        message="Are you sure you want to delete this site? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Sites;
