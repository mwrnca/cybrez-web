import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActiveOrganization {
  public_id: string;
  name: string;
}

interface OrganizationStore {
  organization: ActiveOrganization | null;

  setOrganization: (
    organization: ActiveOrganization
  ) => void;

  clearOrganization: () => void;
}

export const useOrganizationStore =
  create<OrganizationStore>()(
    persist(
      (set) => ({
        organization: null,

        setOrganization: (organization) =>
          set({ organization }),

        clearOrganization: () =>
          set({ organization: null }),
      }),
      {
        name: "active-organization",
      }
    )
  );