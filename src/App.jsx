import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";

import { STATUS_LABELS } from "./constants/applicationStatus";
import {
  createApplication,
  updateApplication,
  deleteApplication,
} from "./features/applications/api/applicationsApi";
import { useApplications } from "./features/applications/hooks/useApplications";

const INITIAL_FORM = {
  company: "",
  position: "",
  status: "applied",
  description: "",
};

function App() {
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
  const [csrfToken, setCsrfToken] = useState("");

  // --- lifecycle -------------------------------------------------------------

  useEffect(() => {
    refresh();

    (async () => {
      try {
        const response = await fetch("/csrf-token", { credentials: "include" });
        const data = await response.json();
        setCsrfToken(data.token);
      } catch {
        // CSRF hiba ritka, de UX szempontból fontos
        console.error("CSRF token lekérés sikertelen");
      }
    })();
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
      await deleteApplication(id, csrfToken);
      await refresh();
    } catch {
      alert("Törlés sikertelen.");
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
        ? await updateApplication(editingApplication.id, form, csrfToken)
        : await createApplication(form, csrfToken);

      if (!response.ok) {
        if (response.status === 422 && isJson) {
          setFieldErrors(payload.errors ?? {});
          setModalError("Kérlek töltsd ki a kötelező mezőket.");
          return;
        }

        if (response.status === 419) {
          setModalError("Érvénytelen CSRF token. Frissítsd az oldalt.");
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
      </header>

      <button
        onClick={openCreate}
        className="rounded-xl bg-blue-600 px-4 py-2 text-white mt-4 mb-4"
      >
        + Új állásjelentkezés
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

export default App;
