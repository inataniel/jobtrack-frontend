async function parseJsonOrText(response) {
  const ct = response.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();
  return { isJson, payload };
}

export async function listApplications() {
  const response = await fetch("/api/applications", { credentials: "include" });
  const { payload } = await parseJsonOrText(response);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Array.isArray(payload) ? payload : [];
}

export async function createApplication(data, csrfToken) {
  const response = await fetch("/api/applications", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const { isJson, payload } = await parseJsonOrText(response);
  return { response, isJson, payload };
}

export async function updateApplication(id, data, csrfToken) {
  const response = await fetch(`/api/applications/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const { isJson, payload } = await parseJsonOrText(response);
  return { response, isJson, payload };
}

export async function deleteApplication(id, csrfToken) {
  const response = await fetch(`/api/applications/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
      Accept: "application/json",
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}
