import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

export interface ConversationSummary {
  public_id: string;
  service_offering_id: string;
  service_title: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  updated_at: string;
}

export interface DirectMessage {
  public_id: string;
  sender_user_id: string;
  sender_name: string;
  body: string;
  created_at: string;
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const response = await api.get<ConversationSummary[]>(ENDPOINTS.messages.conversations);
  return response.data;
}

export async function startConversation(data: {
  service_offering_id: string;
  body: string;
}): Promise<ConversationSummary> {
  const response = await api.post<ConversationSummary>(ENDPOINTS.messages.conversations, data);
  return response.data;
}

export async function getConversationMessages(id: string): Promise<DirectMessage[]> {
  const response = await api.get<DirectMessage[]>(ENDPOINTS.messages.messages(id));
  return response.data;
}

export async function sendMessage(id: string, body: string): Promise<DirectMessage> {
  const response = await api.post<DirectMessage>(
    ENDPOINTS.messages.messages(id),
    { body },
  );
  return response.data;
}