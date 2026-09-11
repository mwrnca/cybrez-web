import { create } from "zustand";

export type Density = "compact" | "default" | "comfortable" | "spacious";

type UiState = {
	sidebarCollapsed: boolean;
	density: Density;
	setSidebarCollapsed: (collapsed: boolean) => void;
	setDensity: (density: Density) => void;
};

const SIDEBAR_STORAGE_KEY = "cybrez-sidebar-collapsed";
const DENSITY_STORAGE_KEY = "cybrez-density";

function getSidebarCollapsed() {
	return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

function getDensity(): Density {
	const saved = localStorage.getItem(DENSITY_STORAGE_KEY);

	if (
		saved === "compact" ||
		saved === "default" ||
		saved === "comfortable" ||
		saved === "spacious"
	) {
		return saved;
	}

	return "default";
}

export const useUiStore = create<UiState>((set) => ({
	sidebarCollapsed: getSidebarCollapsed(),
	density: getDensity(),
	setSidebarCollapsed: (sidebarCollapsed) => {
		localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
		set({ sidebarCollapsed });
	},
	setDensity: (density) => {
		localStorage.setItem(DENSITY_STORAGE_KEY, density);
		document.documentElement.dataset.density = density;
		set({ density });
	},
}));
