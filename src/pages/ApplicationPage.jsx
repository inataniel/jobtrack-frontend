import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";

import { STATUS_LABELS } from "../constants/applicationStatus";
import {
  createApplication,
  updateApplication,
  deleteApplication,
  deleteAllApplications,
} from "../features/applications/api/applicationsApi";
import { useApplications } from "../features/applications/hooks/useApplications";

import { useAuth } from "../features/auth/AuthContext";

const INITIAL_FORM = {
  company: "",
  position: "",
  status: "applied",
  description: "",
};

export default function ApplicationPage() {
  const { logout } = useAuth();
  
  const {
    applications,
    loading,
    listError,
    refresh,
  } = useApplications();

  const [form, setForm] = useState(INITIAL_FORM);
  const [editingApplication, setEditingApplication] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // --- lifecycle -------------------------------------------------------------

  useEffect(() => {
    refresh();
  }, [refresh]);

  // --- helpers ---------------------------------------------------------------

  const resetForm = () => setForm(INITIAL_FORM);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
    setModalError("");
    setFieldErrors({});
    resetForm();
  };

  const openCreate = () => {
    resetForm();
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const openEdit = (application) => {
    setEditingApplication(application);
    setForm({
      company: application.company ?? "",
      position: application.position ?? "",
      status: application.status ?? "applied",
      description: application.description ?? "",
    });
    setIsModalOpen(true);
  };

  // --- handlers --------------------------------------------------------------

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = async (id) => {
    if (!confirm("Biztosan törlöd ezt a jelentkezést?")) return;

    try {
      await deleteApplication(id);
      await refresh();
    } catch {
      alert("Törlés sikertelen.");
    }
  };

  const handleDeleteAll = async () => {
    const ok = confirm(
      "Biztosan törölni szeretnéd AZ ÖSSZES jelentkezést? Ez nem visszavonható."
    );

    if (!ok) return;

    try {
      await deleteAllApplications();
      await refresh();
    } catch {
      alert("Az összes jelentkezés törlése sikertelen.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setFieldErrors({});

    if (!form.company.trim() || !form.position.trim()) {
      setModalError("A cég neve és a pozíció kötelező.");
      return;
    }

    const isEdit = Boolean(editingApplication?.id);

    try {
      const { response, isJson, payload } = isEdit
        ? await updateApplication(editingApplication.id, form)
        : await createApplication(form);

      if (!response.ok) {
        if (response.status === 422 && isJson) {
          setFieldErrors(payload.errors ?? {});
          setModalError("Kérlek töltsd ki a kötelező mezőket.");
          return;
        }

        setModalError(`Mentés sikertelen (HTTP ${response.status}).`);
        return;
      }

      closeModal();
      await refresh();
    } catch {
      setModalError("Hálózati hiba történt.");
    }
  };

  // --- render ----------------------------------------------------------------

  return (
    <div className="min-h-screen m-4">
      <header>
        <h1 className="text-2xl font-bold">JobTrack</h1>
        <p>Állásjelentkezések nyomon követése</p>
        <button
          onClick={logout}
          className="bg-gray-500 text-white px-3 py-1 rounded ml-4"
        >
          Kilépés
        </button>
      </header>

      <button
        onClick={openCreate}
        className="rounded-xl bg-blue-600 px-4 py-2 text-white mt-4 mb-4"
      >
        + Új állásjelentkezés
      </button>

      <button
        onClick={handleDeleteAll}
        className="rounded-xl bg-red-600 px-4 py-2 text-white ml-4 mb-4"
        disabled={applications.length === 0}
      >
        - Összes állásjelentkezés törlése
      </button>

      <ApplicationList
        applications={applications}
        loading={loading}
        error={listError}
        statusLabels={STATUS_LABELS}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingApplication ? "Jelentkezés szerkesztése" : "Új jelentkezés"}
      >
        <ApplicationForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          generalError={modalError}
          errors={fieldErrors}
        />
      </Modal>
    </div>
  );
}
