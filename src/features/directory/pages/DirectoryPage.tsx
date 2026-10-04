import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getDirectory } from "../api/directoryApi";
import type { DirectoryListing, DirectoryService } from "../types/directory";

function ServiceCard({
  service,
}: {
  service: DirectoryService;
}) {
  const initial = service.provider_name.charAt(0).toUpperCase();

  return (
    <Link
      to={`/directory/services/${service.public_id}`}
      className="cybrez-directory-service-card cybrez-card"
    >
      <div className="cybrez-directory-service-topline">
        <span className="cybrez-badge">{service.category}</span>
        <span>{service.rate_description || "Contact for rates"}</span>
      </div>
      <div className="cybrez-directory-service-provider">
        <div className="cybrez-organization-card-icon">
          {initial}
        </div>
        <div>
          <strong>{service.provider_name}</strong>
          <small>{service.provider_type}</small>
        </div>
      </div>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <span className="cybrez-directory-card-link">View service details →</span>
    </Link>
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

  const listing = data as DirectoryListing | undefined;
  const services = listing?.services ?? [];
  const organizations = listing?.organizations ?? [];

  return (
    <div className="cybrez-page">
      <div className="cybrez-organizations-page">
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              Marketplace
            </span>

            <h1>Directory</h1>

            <p>
              Find useful services from people and organizations across CYBREZ.
            </p>
          </div>

          <div className="cybrez-page-header-stat">
            <span>Published services</span>
            <strong>{services.length}</strong>
          </div>
        </header>

        <section className="cybrez-organizations-section">
          <div className="cybrez-section-header">
            <div>
              <h2>Services</h2>
              <p>Explore published offers and contact providers directly.</p>
            </div>
          </div>

          {services.length > 0 ? (
            <div className="cybrez-organizations-grid">
              {services.map((service) => (
                <ServiceCard
                  key={service.public_id}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="cybrez-empty-state cybrez-card">
              <div className="cybrez-empty-state-icon">
                S
              </div>

              <h3>No published services yet</h3>

              <p>
                Published services will appear here. You can create an offer from My Services.
              </p>
            </div>
          )}
        </section>

        <section className="cybrez-organizations-section">
          <div className="cybrez-section-header">
            <div>
              <h2>Organizations</h2>
              <p>Organizations that chose to appear in the directory.</p>
            </div>
          </div>
          {organizations.length ? (
            <div className="cybrez-organizations-grid">
              {organizations.map((organization) => (
                <Link
                  key={organization.public_id}
                  className="cybrez-directory-organization-card cybrez-card"
                  to={`/directory/organizations/${organization.public_id}`}
                >
                  <span className="cybrez-badge">Organization</span>
                  <h3>{organization.name}</h3>
                  <p>{organization.description || "No description provided."}</p>
                  <span className="cybrez-directory-card-link">View profile →</span>
                </Link>
              ))}
            </div>
          ) : <p className="cybrez-directory-muted">No organizations have opted into the directory yet.</p>}
        </section>
      </div>
    </div>
  );
}