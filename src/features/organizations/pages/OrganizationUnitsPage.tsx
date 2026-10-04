import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import { useMembers } from "@/features/memberships/hooks";
import { useAuth } from "@/contexts/useAuth";
import { formatUserFacingError } from "@/utils/errorUtils";

import {
  addOrganizationUnitMember,
  createOrganizationUnit,
  deleteOrganizationUnit,
  getOrganizationUnitMembers,
  getOrganizationUnits,
  removeOrganizationUnitMember,
  updateOrganizationUnit,
} from "../api/organizationUnitsApi";
import type { OrganizationUnit } from "../api/organizationUnitsApi";

export default function OrganizationUnitsPage() {
  const { organizationId = "" } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentUnitId, setParentUnitId] = useState("");
  const [memberToAdd, setMemberToAdd] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const unitsQuery = useQuery({
    queryKey: ["organization-units", organizationId],
    queryFn: () => getOrganizationUnits(organizationId),
    enabled: !!organizationId,
  });
  const membersQuery = useMembers(organizationId);
  const myRole = membersQuery.data?.find(
    (member) => member.user_id === user?.public_id,
  )?.role;
  const canManageUnits = myRole === "owner" || myRole === "admin";
  const canAssignMembers = canManageUnits || myRole === "manager";
  const units = useMemo(() => unitsQuery.data ?? [], [unitsQuery.data]);
  const selectedUnit = units.find((unit) => unit.public_id === selectedUnitId);
  const unitMembersQuery = useQuery({
    queryKey: ["organization-unit-members", organizationId, selectedUnitId],
    queryFn: () => getOrganizationUnitMembers(organizationId, selectedUnitId),
    enabled: !!organizationId && !!selectedUnitId,
  });

  const unitLabels = useMemo(() => {
    const unitMap = new Map(units.map((unit) => [unit.public_id, unit]));

    return new Map(units.map((unit) => {
      const segments: string[] = [];
      const visited = new Set<string>();
      let current: OrganizationUnit | undefined = unit;

      while (current && !visited.has(current.public_id)) {
        visited.add(current.public_id);
        segments.unshift(current.name);
        current = current.parent_unit_id
          ? unitMap.get(current.parent_unit_id)
          : undefined;
      }

      return [unit.public_id, segments.join(" / ")];
    }));
  }, [units]);

  const descendantIds = useMemo(() => {
    if (!editingUnitId) return new Set<string>();

    const result = new Set<string>();
    let frontier = [editingUnitId];
    while (frontier.length) {
      const parentId = frontier.pop()!;
      const children = units.filter((unit) => unit.parent_unit_id === parentId);
      for (const child of children) {
        if (!result.has(child.public_id)) {
          result.add(child.public_id);
          frontier.push(child.public_id);
        }
      }
    }
    return result;
  }, [editingUnitId, units]);

  function invalidateUnits() {
    return queryClient.invalidateQueries({
      queryKey: ["organization-units", organizationId],
    });
  }

  const saveUnit = useMutation({
    mutationFn: () => editingUnitId
      ? updateOrganizationUnit(organizationId, editingUnitId, {
          name,
          description: description || null,
          parent_unit_id: parentUnitId || null,
        })
      : createOrganizationUnit(organizationId, {
          name,
          description: description || null,
          parent_unit_id: parentUnitId || null,
        }),
    onSuccess: async (unit) => {
      await invalidateUnits();
      setSelectedUnitId(unit.public_id);
      setEditingUnitId(null);
      setName("");
      setDescription("");
      setParentUnitId("");
      setActionError(null);
    },
    onError: (error) => setActionError(formatUserFacingError(error, "Unable to save this unit.")),
  });

  const deleteUnit = useMutation({
    mutationFn: (unitId: string) => deleteOrganizationUnit(organizationId, unitId),
    onSuccess: async (_, unitId) => {
      await invalidateUnits();
      if (selectedUnitId === unitId) setSelectedUnitId("");
      if (editingUnitId === unitId) setEditingUnitId(null);
      setActionError(null);
    },
    onError: (error) => setActionError(formatUserFacingError(error, "Unable to delete this unit.")),
  });

  const addMember = useMutation({
    mutationFn: (userId: string) => addOrganizationUnitMember(organizationId, selectedUnitId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organization-unit-members", organizationId, selectedUnitId],
      });
      setMemberToAdd("");
      setActionError(null);
    },
    onError: (error) => setActionError(formatUserFacingError(error, "Unable to assign this member.")),
  });

  const removeMember = useMutation({
    mutationFn: (userId: string) => removeOrganizationUnitMember(organizationId, selectedUnitId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organization-unit-members", organizationId, selectedUnitId],
      });
      setActionError(null);
    },
    onError: (error) => setActionError(formatUserFacingError(error, "Unable to remove this member.")),
  });

  if (unitsQuery.isLoading || unitsQuery.isError) {
    return (
      <PageState
        loading={unitsQuery.isLoading}
        error={unitsQuery.isError ? unitsQuery.error : undefined}
        loadingMessage="Loading organization units..."
        errorTitle="Unable to load organization units"
        errorMessage={formatUserFacingError(unitsQuery.error, "Unable to load organization units.")}
        onRetry={() => unitsQuery.refetch()}
      >
        <div />
      </PageState>
    );
  }

  const assignedIds = new Set((unitMembersQuery.data ?? []).map((member) => member.user_id));
  const availableMembers = (membersQuery.data ?? []).filter((member) => !assignedIds.has(member.user_id));

  function beginEdit(unit: OrganizationUnit) {
    setEditingUnitId(unit.public_id);
    setName(unit.name);
    setDescription(unit.description ?? "");
    setParentUnitId(unit.parent_unit_id ?? "");
  }

  function beginCreate() {
    setEditingUnitId(null);
    setName("");
    setDescription("");
    setParentUnitId("");
  }

  return (
    <div className="cybrez-page">
      <main className="cybrez-unit-management">
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">Organization</span>
            <h1>Organization units</h1>
            <p>Arrange teams and assign organization members.</p>
          </div>
          <Link className="cybrez-button cybrez-button-secondary" to={`/organizations/${organizationId}`}>
            Back to organization
          </Link>
        </header>

        {actionError && <p className="cybrez-unit-error" role="alert">{actionError}</p>}

        <div className="cybrez-unit-layout">
          <section className="cybrez-unit-list" aria-label="Organization units">
            <div className="cybrez-unit-section-heading">
              <h2>Structure</h2>
              {canManageUnits && (
                <button type="button" className="cybrez-button cybrez-button-primary" onClick={beginCreate}>
                  + New unit
                </button>
              )}
            </div>
            {units.length ? units.map((unit) => (
              <article className={`cybrez-unit-row${unit.public_id === selectedUnitId ? " is-selected" : ""}`} key={unit.public_id}>
                <button type="button" className="cybrez-unit-select" onClick={() => setSelectedUnitId(unit.public_id)}>
                  <strong>{unit.name}</strong>
                  <small>{unitLabels.get(unit.public_id)}</small>
                </button>
                {canManageUnits && (
                  <div className="cybrez-unit-actions">
                    <button type="button" onClick={() => beginEdit(unit)}>Edit</button>
                    <button type="button" onClick={() => {
                      if (window.confirm(`Delete “${unit.name}”?`)) deleteUnit.mutate(unit.public_id);
                    }}>Delete</button>
                  </div>
                )}
              </article>
            )) : <p className="cybrez-unit-empty">No units have been created.</p>}
          </section>

          {canManageUnits && <section className="cybrez-unit-editor">
            <h2>{editingUnitId ? "Edit unit" : "Create unit"}</h2>
            <form onSubmit={(event) => { event.preventDefault(); saveUnit.mutate(); }}>
              <label className="cybrez-form-field">
                <span>Name</span>
                <input className="cybrez-input" value={name} onChange={(event) => setName(event.target.value)} required maxLength={255} />
              </label>
              <label className="cybrez-form-field">
                <span>Description</span>
                <textarea className="cybrez-textarea" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} rows={3} />
              </label>
              <label className="cybrez-form-field">
                <span>Parent unit</span>
                <select className="cybrez-select" value={parentUnitId} onChange={(event) => setParentUnitId(event.target.value)}>
                  <option value="">No parent</option>
                  {units.filter((unit) => unit.public_id !== editingUnitId && !descendantIds.has(unit.public_id)).map((unit) => (
                    <option key={unit.public_id} value={unit.public_id}>{unitLabels.get(unit.public_id)}</option>
                  ))}
                </select>
              </label>
              <div className="cybrez-unit-form-actions">
                <button type="submit" className="cybrez-button cybrez-button-primary" disabled={saveUnit.isPending || !name.trim()}>
                  {saveUnit.isPending ? "Saving..." : editingUnitId ? "Save unit" : "Create unit"}
                </button>
                {editingUnitId && <button type="button" className="cybrez-button cybrez-button-ghost" onClick={beginCreate}>Cancel</button>}
              </div>
            </form>
          </section>}
        </div>

        <section className="cybrez-unit-members">
          <div className="cybrez-unit-section-heading">
            <div>
              <h2>Unit members</h2>
              <p>{selectedUnit ? unitLabels.get(selectedUnit.public_id) : "Select a unit to manage its members."}</p>
            </div>
          </div>
          {selectedUnit && (
            <>
              {canAssignMembers && <form className="cybrez-unit-member-add" onSubmit={(event) => { event.preventDefault(); if (memberToAdd) addMember.mutate(memberToAdd); }}>
                <select className="cybrez-select" value={memberToAdd} onChange={(event) => setMemberToAdd(event.target.value)} disabled={membersQuery.isLoading || availableMembers.length === 0}>
                  <option value="">{availableMembers.length ? "Choose an organization member" : "All members are assigned"}</option>
                  {availableMembers.map((member) => <option key={member.user_id} value={member.user_id}>{member.user_full_name} · {member.user_email}</option>)}
                </select>
                <button className="cybrez-button cybrez-button-secondary" type="submit" disabled={!memberToAdd || addMember.isPending}>Assign</button>
              </form>}
              {unitMembersQuery.isLoading ? <p>Loading unit members...</p> : (
                <ul className="cybrez-unit-member-list">
                  {(unitMembersQuery.data ?? []).map((member) => (
                    <li key={member.public_id}>
                      <span><strong>{member.user_full_name}</strong><small>{member.user_email}</small></span>
                      {canAssignMembers && <button type="button" onClick={() => removeMember.mutate(member.user_id)} disabled={removeMember.isPending}>Remove</button>}
                    </li>
                  ))}
                  {!unitMembersQuery.data?.length && <li className="cybrez-unit-empty">No members assigned to this unit.</li>}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}