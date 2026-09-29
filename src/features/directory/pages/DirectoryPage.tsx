import { useQuery } from "@tanstack/react-query";

import { getDirectory } from "../api/directoryApi";
import type { DirectoryPerson } from "../types/directory";

function PersonCard({
  person,
}: {
  person: DirectoryPerson;
}) {
  const initial = person.full_name.charAt(0).toUpperCase();

  return (
    <article className="cybrez-organization-card cybrez-card">
      <div className="cybrez-organization-card-header">
        <div className="cybrez-organization-card-icon">
          {initial}
        </div>

        

        <div>
          <h3>{person.full_name}</h3>

          <span className="cybrez-badge">
            Person
          </span>
        </div>
      </div>

      <div className="cybrez-organization-card-description">
        {person.organizations.length > 0 ? (
          <>
            <strong>Organizations</strong>

            <div style={{ marginTop: "0.5rem" }}>
              {person.organizations.map((organization) => (
                <div
                  key={organization.public_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  {/* <span>{organization.name}</span> */}

                  {/* <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    {organization.role}
                  </span> */}
                </div>
              ))}
            </div>
          </>
        ) : (
          "No organization information available."
        )}
      </div>

      <div className="cybrez-organization-card-actions">
        <button
          type="button"
          className="cybrez-button cybrez-button-primary"
        >
          View profile
        </button>
      </div>
    </article>
  );
}

export default function DirectoryPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["directory"],
    queryFn: getDirectory,
  });

  if (isLoading) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state">
          <div className="cybrez-loading-indicator" />
          <p>Loading directory...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>Unable to load directory</h2>
          <p>{String(error)}</p>
        </div>
      </div>
    );
  }

  const people = data ?? [];

  return (
    <div className="cybrez-page">
      <div className="cybrez-organizations-page">
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              People
            </span>

            <h1>Directory</h1>

            <p>
              Find people and understand where they
              work across CYBREZ.
            </p>
          </div>

          <div className="cybrez-page-header-stat">
            <span>Total people</span>

            <strong>{people.length}</strong>
          </div>
        </header>

        <section className="cybrez-organizations-section">
          <div className="cybrez-section-header">
            <div>
              <h2>People</h2>

              <p>
                People connected to organizations you
                can work with.
              </p>
            </div>
          </div>

          {people.length > 0 ? (
            <div className="cybrez-organizations-grid">
              {people.map((person) => (
                <PersonCard
                  key={person.public_id}
                  person={person}
                />
              ))}
            </div>
          ) : (
            <div className="cybrez-empty-state cybrez-card">
              <div className="cybrez-empty-state-icon">
                P
              </div>

              <h3>No people yet</h3>

              <p>
                People connected to organizations will
                appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}