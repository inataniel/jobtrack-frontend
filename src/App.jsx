import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import ApplicationForm from "./components/ApplicationForm";

function App() {
  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "applied",
    description: "",
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("Mentés sikertelen. Ellenőrizd a backend logot / validációt.");
      return;
    }

    const data = await response.json();
    console.log(data);

    // form ürítés
    setForm({
      company: "",
      position: "",
      status: "applied",
      description: "",
    });

    // lista frissítés
    await fetchApplications();
    setIsModalOpen(false);
  };

  const STATUS_OPTIONS = {
    applied: "Jelentkezés elküldve",
    invited_to_interview: "Interjúra behívva",
    interview_done: "Interjú lezajlott",
    test_assigned: "Tesztfeladat kiküldve",
    test_submitted: "Tesztfeladat elküldve",
    offer: "Ajánlatot kaptam",
    rejected: "Elutasítva",
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Nem sikerült betölteni a jelentkezéseket. Ellenőrizd, hogy fut-e a backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Jelentkezések</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white"
        >
          + Új jelentkezés
        </button>

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Új jelentkezés">
          <ApplicationForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

        {loading && <p className="text-sm opacity-70">Betöltés…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <p className="text-sm opacity-70">Még nincs felvitt jelentkezés.</p>
        )}

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{app.company}</p>
                  <p className="text-sm opacity-80">{app.position}</p>
                </div>

                <span className="text-xs px-2 py-1 rounded-full border">
                  {STATUS_OPTIONS[app.status] ?? app.status}
                </span>
              </div>

              {app.description && (
                <p className="mt-3 text-sm whitespace-pre-wrap opacity-80">
                  {app.description}
                </p>
              )}

              <p className="mt-3 text-xs opacity-60">
                Létrehozva: {app.created_at ? new Date(app.created_at).toLocaleString("hu-HU") : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;