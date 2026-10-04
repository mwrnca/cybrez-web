export type BlockType = "TEXT" | "CHECKLIST" | "LINK" | "FILE";

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type WorkBlock = {
  id: string;
  type: BlockType;
  title?: string;
  content?: string;
  url?: string;
  completed?: boolean;
  checklistItems?: ChecklistItem[];
  fileName?: string;
  createdAt: string;
  x?: number;
  y?: number;
};

const STORAGE_PREFIX = "cybrez-work-surface:";

export type WorkspaceView = {
  x: number;
  y: number;
  scale: number;
};

export function createWorkBlockId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDefaultBlockPosition(index: number) {
  return {
    x: 64 + (index % 3) * 360,
    y: 64 + Math.floor(index / 3) * 290,
  };
}

export function loadTaskWorkspaceDraft(taskId: string): WorkBlock[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${taskId}`);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((value, index) => {
      const block = value as WorkBlock;
      const position = getDefaultBlockPosition(index);
      return {
        ...block,
        x: typeof block.x === "number" ? block.x : position.x,
        y: typeof block.y === "number" ? block.y : position.y,
      };
    });
  } catch {
    return [];
  }
}

export function saveTaskWorkspaceDraft(taskId: string, blocks: WorkBlock[]) {
  localStorage.setItem(
    `${STORAGE_PREFIX}${taskId}`,
    JSON.stringify(blocks),
  );
}

export function loadTaskWorkspaceView(taskId: string): WorkspaceView {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}view:${taskId}`);
    if (!raw) return { x: 24, y: 24, scale: 1 };

    const value = JSON.parse(raw) as Partial<WorkspaceView>;
    if (
      typeof value.x !== "number" ||
      typeof value.y !== "number" ||
      typeof value.scale !== "number"
    ) {
      return { x: 24, y: 24, scale: 1 };
    }

    return {
      x: value.x,
      y: value.y,
      scale: Math.min(2, Math.max(0.4, value.scale)),
    };
  } catch {
    return { x: 24, y: 24, scale: 1 };
  }
}

export function saveTaskWorkspaceView(taskId: string, view: WorkspaceView) {
  localStorage.setItem(`${STORAGE_PREFIX}view:${taskId}`, JSON.stringify(view));
}