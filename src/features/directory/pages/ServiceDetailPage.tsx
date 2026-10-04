import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import PageState from "@/components/PageState";
import { useAuth } from "@/contexts/useAuth";
import { formatUserFacingError } from "@/utils/errorUtils";

import { getDirectoryService } from "../api/directoryApi";
import { startConversation } from "@/features/messages/api/messagesApi";

export default function ServiceDetailPage() {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const serviceQuery = useQuery({
    queryKey: ["directory-service", serviceId],
    queryFn: () => getDirectoryService(serviceId),
    enabled: !!serviceId,
  });
  const contactMutation = useMutation({
    mutationFn: () => startConversation({
      service_offering_id: serviceId,
      body: message.trim(),
    }),
    onSuccess: (conversation) => navigate(`/messages/${conversation.public_id}`),
  });

  return (
    <PageState
      loading={serviceQuery.isLoading}
      error={serviceQuery.isError ? serviceQuery.error : undefined}
      empty={!serviceQuery.data}
      loadingMessage="Loading service..."
      emptyMessage="This service is no longer available."
    >
      {serviceQuery.data && (
        <main className="cybrez-service-detail">
          <Link className="cybrez-button cybrez-button-ghost" to="/directory">← Directory</Link>
          <header className="cybrez-service-detail-header">
            <span className="cybrez-badge">{serviceQuery.data.category}</span>
            <h1>{serviceQuery.data.title}</h1>
            <p>{serviceQuery.data.summary}</p>
            <span>{serviceQuery.data.provider_name} · {serviceQuery.data.provider_type}</span>
          </header>
          <div className="cybrez-service-detail-grid">
            <article className="cybrez-service-detail-copy">
              <h2>About this service</h2>
              <p>{serviceQuery.data.details}</p>
              {serviceQuery.data.rate_description && (
                <p><strong>Rate:</strong> {serviceQuery.data.rate_description}</p>
              )}
            </article>
            {user?.public_id !== serviceQuery.data.provider_user_id && (
              <form
                className="cybrez-service-contact"
                onSubmit={(event) => { event.preventDefault(); contactMutation.mutate(); }}
              >
                <h2>Contact provider</h2>
                <label>
                  <span>Message</span>
                  <textarea
                    className="cybrez-textarea"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell them a little about what you need..."
                    minLength={1}
                    maxLength={4000}
                    required
                    rows={5}
                  />
                </label>
                {contactMutation.isError && (
                  <p className="cybrez-service-error" role="alert">
                    {formatUserFacingError(contactMutation.error, "Unable to start a conversation.")}
                  </p>
                )}
                <button className="cybrez-button cybrez-button-primary" disabled={contactMutation.isPending || !message.trim()}>
                  {contactMutation.isPending ? "Opening chat..." : "Message provider"}
                </button>
              </form>
            )}
          </div>
        </main>
      )}
    </PageState>
  );
}