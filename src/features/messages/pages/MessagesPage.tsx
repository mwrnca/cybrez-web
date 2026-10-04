import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import { useAuth } from "@/contexts/useAuth";
import { formatUserFacingError } from "@/utils/errorUtils";

import {
  getConversationMessages,
  listConversations,
  sendMessage,
} from "../api/messagesApi";

export default function MessagesPage() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
    refetchInterval: 5000,
  });
  const messagesQuery = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => getConversationMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 5000,
  });
  const sendMutation = useMutation({
    mutationFn: () => sendMessage(conversationId!, draft.trim()),
    onSuccess: async () => {
      setDraft("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["conversation-messages", conversationId] }),
        queryClient.invalidateQueries({ queryKey: ["conversations"] }),
      ]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQuery.data]);

  const conversations = conversationsQuery.data ?? [];
  const activeConversation = conversations.find((item) => item.public_id === conversationId);

  if (conversationsQuery.isLoading) {
    return <PageState loading empty loadingMessage="Loading messages..." emptyMessage=""><div /></PageState>;
  }
  if (conversationsQuery.isError) {
    return <PageState loading={false} error={conversationsQuery.error} empty><div /></PageState>;
  }

  if (conversationId && messagesQuery.isError) {
    return <PageState loading={false} error={messagesQuery.error} empty><div /></PageState>;
  }

  return (
    <div className="cybrez-page">
      <main className="cybrez-messages-page">
        <header className="cybrez-page-header">
          <div><span className="cybrez-badge">Messages</span><h1>Conversations</h1><p>Private chats about services in the directory.</p></div>
        </header>
        <div className="cybrez-message-layout">
          <aside
            className={`cybrez-conversation-list${conversations.length === 0 ? " is-empty" : ""}`}
            aria-label="Conversations"
          >
            {conversations.length ? conversations.map((conversation) => (
              <Link
                key={conversation.public_id}
                to={`/messages/${conversation.public_id}`}
                className={`cybrez-conversation-link${conversation.public_id === conversationId ? " is-active" : ""}`}
              >
                <span className="cybrez-conversation-avatar">{conversation.other_user_name.slice(0, 1).toUpperCase()}</span>
                <span className="cybrez-conversation-link-copy">
                  <strong>{conversation.other_user_name}</strong>
                  <small>{conversation.service_title}</small>
                  <span>{conversation.last_message}</span>
                </span>
                <time>{new Date(conversation.updated_at).toLocaleDateString()}</time>
              </Link>
            )) : <p className="cybrez-conversation-empty">No conversations yet. Contact a provider from a service page.</p>}
          </aside>

          {conversationId ? (
            <section className="cybrez-message-thread">
              {activeConversation ? (
                <header className="cybrez-message-thread-header">
                  <div><strong>{activeConversation.other_user_name}</strong><span>{activeConversation.service_title}</span></div>
                  <Link to={`/directory/services/${activeConversation.service_offering_id}`}>View service</Link>
                </header>
              ) : <p className="cybrez-directory-muted">Conversation unavailable.</p>}
              <div className="cybrez-message-history">
                {(messagesQuery.data ?? []).map((message) => {
                  const ownMessage = message.sender_user_id === user?.public_id;
                  return (
                    <article className={`cybrez-message-bubble${ownMessage ? " is-own" : ""}`} key={message.public_id}>
                      {!ownMessage && <strong>{message.sender_name}</strong>}
                      <p>{message.body}</p>
                      <time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString()}</time>
                    </article>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              {sendMutation.isError && <p className="cybrez-service-error" role="alert">{formatUserFacingError(sendMutation.error, "Unable to send message.")}</p>}
              <form className="cybrez-message-composer" onSubmit={(event) => { event.preventDefault(); sendMutation.mutate(); }}>
                <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} maxLength={4000} placeholder="Write a message..." required />
                <button className="cybrez-button cybrez-button-primary" disabled={!draft.trim() || sendMutation.isPending}>{sendMutation.isPending ? "Sending..." : "Send"}</button>
              </form>
            </section>
          ) : (
            <section className="cybrez-message-empty">
              <span className="cybrez-badge">Inbox</span>
              <h2>Select a conversation</h2>
              <p>Your service inquiries and replies will appear here.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}