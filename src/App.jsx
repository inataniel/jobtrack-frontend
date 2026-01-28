import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "applied",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log(data);
    alert("Elküldve!");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Új állás</h1>

        <input
          name="company"
          placeholder="Cég neve"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="position"
          placeholder="Pozíció"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Megjegyzések (pl. kontakt neve, határidő, benyomások)"
          className="w-full border p-2 rounded"
          rows={4}
          onChange={handleChange}
        />

        <select
          name="status"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Mentés
        </button>
      </form>
    </div>
  );
}

export default App;