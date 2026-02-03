import { useCallback, useState } from "react";
import { listApplications } from "../api/applicationsApi";

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const data = await listApplications();
      setApplications(data);
    } catch {
      setListError("Nem sikerült betölteni a jelentkezéseket. Ellenőrizd, hogy fut-e a backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { applications, setApplications, loading, listError, refresh };
}
