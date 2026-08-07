import { useOrganizationStore } from "@/store/organizationStore";

export function useOrganization() {
  return useOrganizationStore();
}