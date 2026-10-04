import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import PageState from "@/components/PageState";
import { getMyPersonas } from "@/features/personas/api/personasApi";
import type { Persona } from "@/features/personas/types/persona";
import { formatUserFacingError } from "@/utils/errorUtils";

import {
  createService,
  deleteService,
  getMyServices,
  updateService,
} from "../api/servicesApi";
import type { ServiceOffering, ServiceOfferingForm } from "../api/servicesApi";

const emptyForm: ServiceOfferingForm = {
  persona_public_id: "",
  title: "",
  category: "",
  summary: "",
  details: "",
  rate_description: "",
  is_published: false,
};

export default function MyServicesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const personasQuery = useQuery({ queryKey: ["personas", "me"], queryFn: getMyPersonas });
  const servicesQuery = useQuery({ queryKey: ["my-services"], queryFn: getMyServices });

  const refreshServices = () => queryClient.invalidateQueries({ queryKey: ["my-services"] });
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: async () => { await refreshServices(); setForm(emptyForm); setActionError(""); },
    onError: (error) => setActionError(formatUserFacingError(error, "Unable to create this service.")),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ServiceOfferingForm, "persona_public_id"> }) => updateService(id, data),
    onSuccess: async () => { await refreshServices(); setForm(emptyForm); setEditingId(null); setActionError(""); },
    onError: (error) => setActionError(formatUserFacingError(error, "Unable to update this service.")),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: async () => { await refreshServices(); setActionError(""); },
    onError: (error) => setActionError(formatUserFacingError(error, "Unable to delete this service.")),
  });

  if (personasQuery.isLoading || servicesQuery.isLoading) {
    return <PageState loading empty loadingMessage="Loading your services..." emptyMessage=""><div /></PageState>;
  }
  if (personasQuery.isError || servicesQuery.isError) {
    const error = personasQuery.error ?? servicesQuery.error;
    return <PageState loading={false} error={error} empty><div /></PageState>;
  }

  const personas = personasQuery.data ?? [];
  const services = servicesQuery.data ?? [];
  const editablePersonas = personas.filter((persona) => persona.is_public && persona.is_directory_visible);

  function beginEdit(service: ServiceOffering) {
    setEditingId(service.public_id);
    setForm({
      persona_public_id: service.persona_public_id,
      title: service.title,
      category: service.category,
      summary: service.summary,
      details: service.details,
      rate_description: service.rate_description ?? "",
      is_published: service.is_published,
    });
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    if (editingId) {
      const { persona_public_id: _personaId, ...data } = form;
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(form);
    }
  }

  function removeService(service: ServiceOffering) {
    if (window.confirm(`Remove “${service.title}” from your services?`)) {
      deleteMutation.mutate(service.public_id);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="cybrez-page">
      <main className="cybrez-marketplace-management">
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">Marketplace</span>
            <h1>My services</h1>
            <p>Describe what you offer and choose which services appear in the directory.</p>
          </div>
          <Link className="cybrez-button cybrez-button-secondary" to="/personas">Edit public identity</Link>
        </header>

        {actionError && <p className="cybrez-service-error" role="alert">{actionError}</p>}

        <section className="cybrez-service-editor">
          <h2>{editingId ? "Edit service" : "Add a service"}</h2>
          {!editablePersonas.length && (
            <p className="cybrez-directory-muted">
              Publish a persona and enable directory visibility before publishing a service. <Link to="/personas">Manage personas</Link>
            </p>
          )}
          <form onSubmit={submitForm}>
            <label>
              <span>Provider identity</span>
              <select
                className="cybrez-select"
                value={form.persona_public_id}
                onChange={(event) => setForm({ ...form, persona_public_id: event.target.value })}
                disabled={!!editingId}
                required
              >
                <option value="">Choose a public persona</option>
                {(editingId ? personas : editablePersonas).map((persona: Persona) => (
                  <option key={persona.public_id} value={persona.public_id}>{persona.display_name}</option>
                ))}
              </select>
            </label>
            <div className="cybrez-service-form-grid">
              <label><span>Service title</span><input className="cybrez-input" value={form.title} maxLength={160} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
              <label><span>Category</span><input className="cybrez-input" value={form.category} maxLength={80} placeholder="Design, research, consulting..." onChange={(event) => setForm({ ...form, category: event.target.value })} required /></label>
            </div>
            <label><span>Short summary</span><input className="cybrez-input" value={form.summary} maxLength={400} minLength={10} onChange={(event) => setForm({ ...form, summary: event.target.value })} required /></label>
            <label><span>Details</span><textarea className="cybrez-textarea" value={form.details} rows={5} maxLength={10000} minLength={20} onChange={(event) => setForm({ ...form, details: event.target.value })} required /></label>
            <label><span>Rate information</span><input className="cybrez-input" value={form.rate_description} maxLength={160} placeholder="Optional" onChange={(event) => setForm({ ...form, rate_description: event.target.value })} /></label>
            <label className="cybrez-service-publish-toggle">
              <input type="checkbox" checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} />
              <span>Publish in the directory</span>
            </label>
            <div className="cybrez-service-form-actions">
              <button className="cybrez-button cybrez-button-primary" type="submit" disabled={isSaving || (!editingId && !form.persona_public_id)}>{isSaving ? "Saving..." : editingId ? "Save changes" : "Create service"}</button>
              {editingId && <button className="cybrez-button cybrez-button-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="cybrez-my-services-list">
          <div className="cybrez-section-header"><div><h2>Your offers</h2><p>{services.length} service{services.length === 1 ? "" : "s"}</p></div></div>
          {services.length ? services.map((service) => (
            <article className="cybrez-my-service-row" key={service.public_id}>
              <div>
                <div className="cybrez-my-service-meta"><span className="cybrez-badge">{service.category}</span><span>{service.is_published ? "Published" : "Draft"}</span></div>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
              </div>
              <div className="cybrez-unit-actions">
                <button type="button" onClick={() => beginEdit(service)}>Edit</button>
                <button type="button" onClick={() => removeService(service)}>Remove</button>
              </div>
            </article>
          )) : <p className="cybrez-directory-muted">You have not added any services yet.</p>}
        </section>
      </main>
    </div>
  );
}