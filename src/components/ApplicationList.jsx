export default function ApplicationList({
  applications = [],
  loading = false,
  error = "",
  statusLabels = {},
  onEdit,
  onDelete,
}) {
    return (
        <section className="mt-3">
            <div className="flex items-end justify-between gap-4">
                <h2 className="text-xl font-semibold">Jelentkezések</h2>

                <p className="text-sm opacity-70">
                Összesen: {applications.length}
                </p>
            </div>

            <div className="mt-3">
                {loading && <p className="text-sm opacity-70">Betöltés…</p>}

                {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
                )}

                {!loading && !error && applications.length === 0 && (
                <p className="text-sm opacity-70">Még nincs felvitt jelentkezés.</p>
                )}
            </div>

            <div className="mt-4 space-y-3">
                {applications.map((app) => (
                <article
                    key={app.id}
                    className="rounded-2xl border bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-semibold">{app.company}</p>
                            <p className="text-sm opacity-80">{app.position}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="shrink-0 rounded-full border px-2 py-1 text-xs">
                                {statusLabels[app.status] ?? app.status}
                            </span>

                            <button
                                onClick={() => onEdit(app)}
                                className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                            >
                                Szerkesztés
                            </button>

                            <button
                                onClick={() => onDelete(app.id)}
                                className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                            >
                                Törlés
                            </button>
                        </div>
                    </div>

                    {app.description && (
                    <p className="mt-3 whitespace-pre-wrap text-sm opacity-80">
                        {app.description}
                    </p>
                    )}

                    <p className="mt-3 text-xs opacity-60">
                    Létrehozva:{" "}
                    {app.created_at
                        ? new Date(app.created_at).toLocaleString("hu-HU")
                        : "—"}
                    </p>
                </article>
                ))}
            </div>
        </section>
    );
}