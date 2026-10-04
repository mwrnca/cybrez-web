import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import PageState from "@/components/PageState";

import { getDirectoryOrganization } from "../api/directoryApi";

export default function DirectoryOrganizationPage() {
  const { organizationId = "" } = useParams();
  const query = useQuery({
    queryKey: ["directory-organization", organizationId],
    queryFn: () => getDirectoryOrganization(organizationId),
    enabled: !!organizationId,
  });

  return (
    <PageState
      loading={query.isLoading}
      error={query.isError ? query.error : undefined}
      empty={!query.data}
      loadingMessage="Loading organization profile..."
      emptyMessage="This organization is not listed in the directory."
    >
      {query.data && (
        <main className="cybrez-public-organization">
          <Link className="cybrez-button cybrez-button-ghost" to="/directory">← Directory</Link>
          <div className="cybrez-public-organization-mark">
            {query.data.logo_url ? <img src={query.data.logo_url} alt="" /> : query.data.name.slice(0, 1).toUpperCase()}
          </div>
          <span className="cybrez-badge">Organization</span>
          <h1>{query.data.name}</h1>
          <p>{query.data.description || "This organization has not added a description."}</p>
        </main>
      )}
    </PageState>
  );
}