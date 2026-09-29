import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { search } from "../api/searchApi";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const trimmedQuery = initialQuery.trim();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search", trimmedQuery],
    queryFn: () => search(trimmedQuery),
    enabled: trimmedQuery.length > 0,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: trimmed });
  }

  return (
    <div className="cybrez-page">
      <div className="cybrez-organizations-page">
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              Discovery
            </span>

            <h1>Search</h1>

            <p>
              Find organizations, projects, tasks, comments,
              and people you can access.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <input
            className="cybrez-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search CYBREZ..."
            aria-label="Search CYBREZ"
            autoFocus
          />

          <button
            type="submit"
            className="cybrez-button cybrez-button-primary"
          >
            Search
          </button>
        </form>

        {!trimmedQuery && (
          <div className="cybrez-empty-state cybrez-card">
            <h3>Search across your workspace</h3>
            <p>
              Enter a name, project, task, organization, or
              other piece of work.
            </p>
          </div>
        )}

        {trimmedQuery && isLoading && (
          <div className="cybrez-page-state">
            <div className="cybrez-loading-indicator" />
            <p>Searching...</p>
          </div>
        )}

        {trimmedQuery && isError && (
          <div className="cybrez-page-state cybrez-page-state-error">
            <h2>Search failed</h2>
            <p>{String(error)}</p>
          </div>
        )}

        {trimmedQuery && !isLoading && !isError && (
          <>
            <div className="cybrez-section-header">
              <div>
                <h2>Results</h2>
                <p>
                  {data?.length ?? 0} result
                  {(data?.length ?? 0) === 1 ? "" : "s"} for "
                  {trimmedQuery}"
                </p>
              </div>
            </div>

            {data && data.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                {data.map((result) => (
                  <Link
                    key={`${result.type}-${result.public_id}`}
                    to={result.url}
                    className="cybrez-card"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <h3>{result.title}</h3>
                        <p>{result.subtitle}</p>
                      </div>

                      <span className="cybrez-badge">
                        {result.type}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="cybrez-empty-state cybrez-card">
                <h3>No results</h3>
                <p>
                  Nothing matching "{trimmedQuery}" was found.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}