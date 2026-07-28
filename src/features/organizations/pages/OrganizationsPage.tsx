import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
} from "../hooks";
import type { Organization } from "@/types/organization";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationForm from "../components/OrganizationForm";
export default function OrganizationsPage() {
  const { data, isLoading, isError, error } =
    useOrganizations();

  const createOrganization = useCreateOrganization();

  const navigate = useNavigate();
  const updateOrganization = useUpdateOrganization();
  const deleteOrganization = useDeleteOrganization();
  const [editingId, setEditingId] = useState<string | null>(null);

const [editingOrganization, setEditingOrganization] =
  useState<Organization | undefined>();
  if (isLoading) {
    return <h2>Loading organizations...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }


  function handleEdit(organization: Organization) {
  setEditingId(organization.public_id);
  setEditingOrganization(organization);
}
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Organizations</h1>

      <OrganizationForm
      initialData={editingOrganization}
  loading={
    createOrganization.isPending ||
    updateOrganization.isPending
  }
  onSubmit={async (data) => {
    if (editingId) {
      await updateOrganization.mutateAsync({
        id: editingId,
        data,
      });

      setEditingId(null);
    } else {
      await createOrganization.mutateAsync(data);
    }
  }}
/>

      <hr />

      <h2>Total: {data?.length ?? 0}</h2>

      {data?.map((organization) => (
  <div
    key={organization.public_id}
    style={{
      border: "1px solid gray",
      padding: "1rem",
      marginBottom: "1rem",
    }}
  >
    <h3>{organization.name}</h3>

    <p>{organization.description}</p>

    <small>{organization.public_id}</small>

    <br />
    <br />

    <button
      onClick={() =>
        navigate(`/organizations/${organization.public_id}`)
      }
    >
      View
    </button>

    <button
      onClick={() => handleEdit(organization)}
      style={{ marginLeft: "8px" }}
    >
      Edit
    </button>

    <button
      onClick={() =>
        deleteOrganization.mutate(organization.public_id)
      }
      style={{ marginLeft: "8px" }}
    >
      Delete
    </button>
  </div>
))}
    </div>
  );
}