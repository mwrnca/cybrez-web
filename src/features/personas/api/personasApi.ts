import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  Persona,
  CreatePersonaRequest,
  UpdatePersonaRequest,
} from "../types/persona";

export async function getMyPersonas(): Promise<Persona[]> {
  const response = await api.get<Persona[]>(
    ENDPOINTS.personas.list
  );

  return response.data;
}

export async function createPersona(
  data: CreatePersonaRequest
): Promise<Persona> {
  const response = await api.post<Persona>(
    ENDPOINTS.personas.create,
    data
  );

  return response.data;
}

export async function updatePersona(
  id: string,
  data: UpdatePersonaRequest
): Promise<Persona> {
  const response = await api.patch<Persona>(
    ENDPOINTS.personas.update(id),
    data
  );

  return response.data;
}

export async function deletePersona(
  id: string
): Promise<Persona> {
  const response = await api.delete<Persona>(
    ENDPOINTS.personas.delete(id)
  );

  return response.data;
}