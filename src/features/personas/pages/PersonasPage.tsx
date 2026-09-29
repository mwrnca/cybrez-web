import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPersona,
  deletePersona,
  getMyPersonas,
  updatePersona,
} from "../api/personasApi";

import type {
  CreatePersonaRequest,
  Persona,
  PersonaType,
} from "../types/persona";

const PERSONA_TYPES: PersonaType[] = [
  "consumer",
  "professional",
  "business",
  "institution",
];

const emptyForm: CreatePersonaRequest = {
  type: "professional",
  display_name: "",
  slug: "",
  bio: "",
  is_public: false,
  is_directory_visible: false,
};

export default function PersonasPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreatePersonaRequest>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const personasQuery = useQuery({
    queryKey: ["personas", "me"],
    queryFn: getMyPersonas,
  });

  const createMutation = useMutation({
    mutationFn: createPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["personas", "me"],
      });
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CreatePersonaRequest;
    }) => updatePersona(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["personas", "me"],
      });
      setForm(emptyForm);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePersona,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["personas", "me"],
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: form,
      });
    } else {
      createMutation.mutate(form);
    }
  }

  function startEdit(persona: Persona) {
    setEditingId(persona.public_id);

    setForm({
      type: persona.type,
      display_name: persona.display_name,
      slug: persona.slug,
      bio: persona.bio ?? "",
      is_public: persona.is_public,
      is_directory_visible: persona.is_directory_visible,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(persona: Persona) {
    const confirmed = window.confirm(
      `Delete the "${persona.type}" persona "${persona.display_name}"?`
    );

    if (confirmed) {
      deleteMutation.mutate(persona.public_id);
    }
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  if (personasQuery.isLoading) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state">
          <div className="cybrez-loading-indicator" />
          <p>Loading personas...</p>
        </div>
      </div>
    );
  }

  if (personasQuery.isError) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>Unable to load personas</h2>
          <p>{String(personasQuery.error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cybrez-page">
      <div className="cybrez-organizations-page">
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              Identity
            </span>

            <h1>Personas</h1>

            <p>
              Create different ways to represent yourself on
              CYBREZ.
            </p>
          </div>

          <div className="cybrez-page-header-stat">
            <span>Your personas</span>
            <strong>{personasQuery.data?.length ?? 0}</strong>
          </div>
        </header>

        <section className="cybrez-card" style={{ marginBottom: "2rem" }}>
          <div className="cybrez-section-header">
            <div>
              <h2>
                {editingId ? "Edit persona" : "Create persona"}
              </h2>
              <p>
                A persona describes how you appear or participate
                in CYBREZ.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <label>
              <span>Type</span>
              <select
                className="cybrez-input"
                value={form.type}
                onChange={(event) =>
                  setForm({
                    ...form,
                    type: event.target.value as PersonaType,
                  })
                }
              >
                {PERSONA_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Display name</span>
              <input
                className="cybrez-input"
                value={form.display_name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    display_name: event.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              <span>Slug</span>
              <input
                className="cybrez-input"
                value={form.slug}
                onChange={(event) =>
                  setForm({
                    ...form,
                    slug: event.target.value,
                  })
                }
                placeholder="your-name"
                required
              />
            </label>

            <label>
              <span>Bio</span>
              <textarea
                className="cybrez-input"
                value={form.bio}
                onChange={(event) =>
                  setForm({
                    ...form,
                    bio: event.target.value,
                  })
                }
                rows={4}
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={(event) =>
                  setForm({
                    ...form,
                    is_public: event.target.checked,
                    is_directory_visible:
                      event.target.checked
                        ? form.is_directory_visible
                        : false,
                  })
                }
              />{" "}
              Public profile
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.is_directory_visible}
                disabled={!form.is_public}
                onChange={(event) =>
                  setForm({
                    ...form,
                    is_directory_visible:
                      event.target.checked,
                  })
                }
              />{" "}
              Show in public directory
            </label>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
              }}
            >
              <button
                type="submit"
                className="cybrez-button cybrez-button-primary"
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Create persona"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cybrez-button cybrez-button-ghost"
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="cybrez-section-header">
            <div>
              <h2>Your personas</h2>
            </div>
          </div>

          {personasQuery.data &&
          personasQuery.data.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "1rem",
              }}
            >
              {personasQuery.data.map((persona) => (
                <article
                  key={persona.public_id}
                  className="cybrez-card"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <span className="cybrez-badge">
                        {persona.type}
                      </span>

                      <h3>{persona.display_name}</h3>

                      <p>
                        @{persona.slug}
                      </p>

                      <p>
                        {persona.bio ||
                          "No bio provided."}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <button
                        className="cybrez-button cybrez-button-secondary"
                        onClick={() => startEdit(persona)}
                      >
                        Edit
                      </button>

                      <button
                        className="cybrez-button cybrez-button-danger"
                        onClick={() => handleDelete(persona)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    {persona.is_public && (
                      <span className="cybrez-badge">
                        Public
                      </span>
                    )}

                    {persona.is_directory_visible && (
                      <span className="cybrez-badge">
                        Directory
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="cybrez-empty-state cybrez-card">
              <h3>No personas yet</h3>
              <p>
                Create your first persona above.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}