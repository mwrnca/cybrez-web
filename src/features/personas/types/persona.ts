export type PersonaType =
  | "consumer"
  | "professional"
  | "business"
  | "institution";

export interface Persona {
  public_id: string;
  user_public_id: string;
  type: PersonaType;
  display_name: string;
  slug: string;
  bio: string | null;
  is_public: boolean;
  is_directory_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePersonaRequest {
  type: PersonaType;
  display_name: string;
  slug: string;
  bio?: string;
  is_public: boolean;
  is_directory_visible: boolean;
}

export interface UpdatePersonaRequest {
  type?: PersonaType;
  display_name?: string;
  slug?: string;
  bio?: string;
  is_public?: boolean;
  is_directory_visible?: boolean;
}