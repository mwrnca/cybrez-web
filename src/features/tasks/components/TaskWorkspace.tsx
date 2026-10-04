import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

import {
  createWorkBlockId,
  getDefaultBlockPosition,
  loadTaskWorkspaceView,
  loadTaskWorkspaceDraft,
  saveTaskWorkspaceView,
  saveTaskWorkspaceDraft,
  type WorkBlock,
} from "@/utils/taskWorkspaceStorage";

type TaskWorkspaceProps = {
  taskId: string;
  title: string;
  description: string | null | undefined;
  isReadOnly?: boolean;
  archivedBlocks?: WorkBlock[] | null;
};

export default function TaskWorkspace({
  taskId,
  title,
  description,
  isReadOnly = false,
  archivedBlocks,
}: TaskWorkspaceProps) {
  const [blocks, setBlocks] = useState<WorkBlock[]>(() =>
    archivedBlocks ?? loadTaskWorkspaceDraft(taskId),
  );
  const [hydratedTaskId, setHydratedTaskId] = useState(taskId);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [textDraft, setTextDraft] = useState("");
  const [checklistItemsDraft, setChecklistItemsDraft] = useState("");
  const [linkTitleDraft, setLinkTitleDraft] = useState("");
  const [linkUrlDraft, setLinkUrlDraft] = useState("");
  const [view, setView] = useState(() => loadTaskWorkspaceView(taskId));

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const panDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const blockDragRef = useRef<{
    pointerId: number;
    blockId: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    setBlocks(archivedBlocks ?? loadTaskWorkspaceDraft(taskId));
    setHydratedTaskId(taskId);
    setView(loadTaskWorkspaceView(taskId));
    setShowAddMenu(false);
    setEditingId(null);
  }, [taskId, archivedBlocks]);

  useEffect(() => {
    if (!isReadOnly && hydratedTaskId === taskId) {
      saveTaskWorkspaceDraft(taskId, blocks);
    }
  }, [taskId, blocks, hydratedTaskId, isReadOnly]);

  useEffect(() => {
    if (!isReadOnly && hydratedTaskId === taskId) {
      saveTaskWorkspaceView(taskId, view);
    }
  }, [taskId, view, hydratedTaskId, isReadOnly]);

  const handleShortcut = useEffectEvent((event: KeyboardEvent) => {
      if (isReadOnly) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest("input, textarea, select, [contenteditable='true']"))
      ) {
        return;
      }

      if (event.key === "Escape") {
        setShowAddMenu(false);
        return;
      }

      if (event.key.toLowerCase() === "a" && event.shiftKey) {
        event.preventDefault();
        setShowAddMenu((current) => !current);
        return;
      }

      const shortcut = event.key.toLowerCase();
      if (shortcut === "n") {
        event.preventDefault();
        addTextBlock();
      } else if (shortcut === "c") {
        event.preventDefault();
        addChecklistBlock();
      } else if (shortcut === "l") {
        event.preventDefault();
        addLinkBlock();
      } else if (shortcut === "f") {
        event.preventDefault();
        openFilePicker();
      }
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      handleShortcut(event);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const hasBlocks = blocks.length > 0;

  const activeEditBlock = useMemo(
    () => blocks.find((block) => block.id === editingId) ?? null,
    [blocks, editingId],
  );

  function addTextBlock() {
    const block: WorkBlock = {
      id: createWorkBlockId(),
      type: "TEXT",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setBlocks((current) => [
      ...current,
      { ...block, ...getDefaultBlockPosition(current.length) },
    ]);
    setEditingId(block.id);
    setTextDraft("");
    setShowAddMenu(false);
  }

  function addChecklistBlock() {
    const block: WorkBlock = {
      id: createWorkBlockId(),
      type: "CHECKLIST",
      title: "Checklist",
      checklistItems: [{ id: createWorkBlockId(), text: "New item", completed: false }],
      createdAt: new Date().toISOString(),
    };

    setBlocks((current) => [
      ...current,
      { ...block, ...getDefaultBlockPosition(current.length) },
    ]);
    setEditingId(block.id);
    setTextDraft("Checklist");
    setChecklistItemsDraft("New item");
    setShowAddMenu(false);
  }

  function addLinkBlock() {
    const block: WorkBlock = {
      id: createWorkBlockId(),
      type: "LINK",
      title: "",
      url: "",
      createdAt: new Date().toISOString(),
    };

    setBlocks((current) => [
      ...current,
      { ...block, ...getDefaultBlockPosition(current.length) },
    ]);
    setEditingId(block.id);
    setLinkTitleDraft("");
    setLinkUrlDraft("");
    setShowAddMenu(false);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
    setShowAddMenu(false);
  }

  function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const block: WorkBlock = {
      id: createWorkBlockId(),
      type: "FILE",
      fileName: file.name,
      content: `${file.type || "File"} · ${formatFileSize(file.size)}`,
      createdAt: new Date().toISOString(),
    };

    setBlocks((current) => [
      ...current,
      { ...block, ...getDefaultBlockPosition(current.length) },
    ]);

    event.target.value = "";
  }

  function saveTextBlock() {
    if (!editingId) {
      return;
    }

    setBlocks((current) =>
      current.map((block) =>
        block.id === editingId
          ? {
              ...block,
              content: textDraft.trim(),
            }
          : block,
      ),
    );

    setEditingId(null);
  }

  function saveChecklistBlock() {
    if (!editingId) {
      return;
    }

    const previousItems = activeEditBlock?.checklistItems ?? [];
    const checklistItems = checklistItemsDraft
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((text, index) => ({
        id: previousItems[index]?.id ?? createWorkBlockId(),
        text,
        completed: previousItems[index]?.completed ?? false,
      }));

    setBlocks((current) =>
      current.map((block) =>
        block.id === editingId
          ? {
              ...block,
              title: textDraft.trim() || "Checklist",
              checklistItems,
            }
          : block,
      ),
    );

    setEditingId(null);
  }

  function saveLinkBlock() {
    if (!editingId) {
      return;
    }

    const url = linkUrlDraft.trim();

    if (!url) {
      return;
    }

    setBlocks((current) =>
      current.map((block) =>
        block.id === editingId
          ? {
              ...block,
              title: linkTitleDraft.trim() || url,
              url,
            }
          : block,
      ),
    );

    setEditingId(null);
  }

  function startEditing(block: WorkBlock) {
    setEditingId(block.id);

    if (block.type === "TEXT") {
      setTextDraft(block.content ?? "");
    }

    if (block.type === "CHECKLIST") {
      setTextDraft(block.title ?? "Checklist");
      setChecklistItemsDraft(
        (block.checklistItems ?? [{
          id: block.id,
          text: block.title || "Checklist",
          completed: Boolean(block.completed),
        }])
          .map((item) => item.text)
          .join("\n"),
      );
    }

    if (block.type === "LINK") {
      setLinkTitleDraft(block.title ?? "");
      setLinkUrlDraft(block.url ?? "");
    }
  }

  function deleteBlock(id: string) {
    setBlocks((current) => current.filter((block) => block.id !== id));

    if (editingId === id) {
      setEditingId(null);
    }
  }

  function toggleChecklist(id: string, itemId?: string) {
    setBlocks((current) => current.map((block) => {
      if (block.id !== id) return block;
      if (!block.checklistItems) {
        return { ...block, completed: !block.completed };
      }
      return {
        ...block,
        checklistItems: block.checklistItems.map((item) =>
          item.id === itemId
            ? { ...item, completed: !item.completed }
            : item,
        ),
      };
    }));
  }

  function addChecklistItem(id: string) {
    setBlocks((current) => current.map((block) => {
      if (block.id !== id || block.type !== "CHECKLIST") return block;
      const items = block.checklistItems ?? [{
        id: block.id,
        text: block.title || "Checklist",
        completed: Boolean(block.completed),
      }];
      return {
        ...block,
        checklistItems: [
          ...items,
          { id: createWorkBlockId(), text: "New item", completed: false },
        ],
      };
    }));
  }

  function openBlockEditor(block: WorkBlock) {
    if (block.type === "FILE") {
      return;
    }

    startEditing(block);
  }

  function beginCanvasPan(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest(".cybrez-work-block")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    panDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: view.x,
      originY: view.y,
    };
  }

  function beginBlockDrag(
    event: React.PointerEvent<HTMLDivElement>,
    block: WorkBlock,
  ) {
    if (isReadOnly || (event.target as HTMLElement).closest("button")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    blockDragRef.current = {
      pointerId: event.pointerId,
      blockId: block.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: block.x ?? 0,
      originY: block.y ?? 0,
    };
  }

  function handleCanvasPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const blockDrag = blockDragRef.current;
    if (blockDrag?.pointerId === event.pointerId) {
      const deltaX = (event.clientX - blockDrag.startX) / view.scale;
      const deltaY = (event.clientY - blockDrag.startY) / view.scale;
      setBlocks((current) => current.map((block) =>
        block.id === blockDrag.blockId
          ? { ...block, x: blockDrag.originX + deltaX, y: blockDrag.originY + deltaY }
          : block,
      ));
      return;
    }

    const panDrag = panDragRef.current;
    if (panDrag?.pointerId === event.pointerId) {
      setView((current) => ({
        ...current,
        x: panDrag.originX + event.clientX - panDrag.startX,
        y: panDrag.originY + event.clientY - panDrag.startY,
      }));
    }
  }

  function endCanvasPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (blockDragRef.current?.pointerId === event.pointerId) {
      blockDragRef.current = null;
    }
    if (panDragRef.current?.pointerId === event.pointerId) {
      panDragRef.current = null;
    }
  }

  function handleCanvasWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    const cursorX = event.clientX - bounds.left;
    const cursorY = event.clientY - bounds.top;
    const factor = Math.exp(-event.deltaY * 0.001);

    setView((current) => {
      const scale = Math.min(2, Math.max(0.4, current.scale * factor));
      const worldX = (cursorX - current.x) / current.scale;
      const worldY = (cursorY - current.y) / current.scale;
      return {
        x: cursorX - worldX * scale,
        y: cursorY - worldY * scale,
        scale,
      };
    });
  }

  function zoomBy(factor: number) {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const cursorX = bounds.width / 2;
    const cursorY = bounds.height / 2;

    setView((current) => {
      const scale = Math.min(2, Math.max(0.4, current.scale * factor));
      const worldX = (cursorX - current.x) / current.scale;
      const worldY = (cursorY - current.y) / current.scale;
      return {
        x: cursorX - worldX * scale,
        y: cursorY - worldY * scale,
        scale,
      };
    });
  }

  return (
    <main className="cybrez-work-surface">
      <div className="cybrez-work-surface-content">
        <div className="cybrez-work-surface-intro">
          <span className="cybrez-work-surface-kicker">
            Work surface
          </span>

          <h2>{title}</h2>

          <p>
            {description ||
              "This is where the work happens. Add information, bring in relevant material, and move the work forward."}
          </p>
        </div>

        {isReadOnly && (
          <p className="cybrez-work-surface-archive-notice">
            Completed project snapshot · read only
          </p>
        )}

        <div className="cybrez-work-surface-canvas">
          <div
            ref={canvasRef}
            className="cybrez-work-surface-canvas-viewport"
            onPointerDown={beginCanvasPan}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={endCanvasPointer}
            onPointerCancel={endCanvasPointer}
            onWheel={handleCanvasWheel}
          >
            <div
              className="cybrez-work-surface-canvas-world"
              style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
            >
              {blocks.map((block) => (
                <WorkBlockCard
                  key={block.id}
                  block={block}
                  readOnly={isReadOnly}
                  onDragStart={(event) => beginBlockDrag(event, block)}
                  onEdit={() => openBlockEditor(block)}
                  onDelete={() => deleteBlock(block.id)}
                  onToggle={(itemId) => toggleChecklist(block.id, itemId)}
                  onAddChecklistItem={() => addChecklistItem(block.id)}
                  style={{ left: block.x ?? 64, top: block.y ?? 64 }}
                />
              ))}
              {!hasBlocks && (
                <p className="cybrez-work-surface-canvas-empty">
                  {isReadOnly ? "No saved workspace items" : "Your canvas is empty"}
                </p>
              )}
            </div>
          </div>

          <div className="cybrez-work-surface-canvas-toolbar">
            {!isReadOnly && (
              <div className="cybrez-work-surface-add-control">
                <button
                  type="button"
                  className="cybrez-work-surface-add-trigger"
                  title="Add to workspace (Shift+A)"
                  aria-label="Add to workspace"
                  aria-expanded={showAddMenu}
                  onClick={() => setShowAddMenu((current) => !current)}
                >
                  +
                </button>
                {showAddMenu && (
                  <AddMenu
                    onText={addTextBlock}
                    onChecklist={addChecklistBlock}
                    onLink={addLinkBlock}
                    onFile={openFilePicker}
                  />
                )}
              </div>
            )}
            <div className="cybrez-work-surface-zoom-controls" aria-label="Canvas zoom">
              <button type="button" onClick={() => zoomBy(1.2)} aria-label="Zoom in" title="Zoom in">+</button>
              <span>{Math.round(view.scale * 100)}%</span>
              <button type="button" onClick={() => zoomBy(1 / 1.2)} aria-label="Zoom out" title="Zoom out">−</button>
              <button type="button" onClick={() => setView({ x: 24, y: 24, scale: 1 })} aria-label="Reset canvas view" title="Reset view">↺</button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileSelected}
      />

      {activeEditBlock?.type === "TEXT" && (
        <EditorModal
          title="Edit text"
          onClose={() => setEditingId(null)}
          onSave={saveTextBlock}
        >
          <textarea
            className="cybrez-work-surface-editor-input"
            value={textDraft}
            onChange={(event) => setTextDraft(event.target.value)}
            placeholder="Write something..."
            autoFocus
          />
        </EditorModal>
      )}

      {activeEditBlock?.type === "CHECKLIST" && (
        <EditorModal
          title="Edit checklist"
          onClose={() => setEditingId(null)}
          onSave={saveChecklistBlock}
        >
          <input
            className="cybrez-work-surface-editor-input"
            value={textDraft}
            onChange={(event) => setTextDraft(event.target.value)}
            placeholder="Checklist name"
            autoFocus
          />

          <textarea
            className="cybrez-work-surface-editor-input"
            value={checklistItemsDraft}
            onChange={(event) => setChecklistItemsDraft(event.target.value)}
            placeholder="Add one checklist item per line"
            rows={6}
          />
        </EditorModal>
      )}

      {activeEditBlock?.type === "LINK" && (
        <EditorModal
          title="Add link"
          onClose={() => setEditingId(null)}
          onSave={saveLinkBlock}
        >
          <input
            className="cybrez-work-surface-editor-input"
            value={linkTitleDraft}
            onChange={(event) =>
              setLinkTitleDraft(event.target.value)
            }
            placeholder="Link name"
            autoFocus
          />

          <input
            className="cybrez-work-surface-editor-input"
            value={linkUrlDraft}
            onChange={(event) =>
              setLinkUrlDraft(event.target.value)
            }
            placeholder="https://..."
            type="url"
          />
        </EditorModal>
      )}
    </main>
  );
}

function AddMenu({
  onText,
  onChecklist,
  onLink,
  onFile,
}: {
  onText: () => void;
  onChecklist: () => void;
  onLink: () => void;
  onFile: () => void;
}) {
  return (
    <div className="cybrez-work-surface-add-menu">
      <button type="button" onClick={onText}>
        <span className="cybrez-work-surface-menu-icon">T</span>
        <span>
          <strong>Text</strong>
          <small>Add a note <kbd>N</kbd></small>
        </span>
      </button>

      <button type="button" onClick={onChecklist}>
        <span className="cybrez-work-surface-menu-icon">✓</span>
        <span>
          <strong>Checklist</strong>
          <small>Track a set of steps <kbd>C</kbd></small>
        </span>
      </button>

      <button type="button" onClick={onLink}>
        <span className="cybrez-work-surface-menu-icon">↗</span>
        <span>
          <strong>Link</strong>
          <small>Connect an external resource <kbd>L</kbd></small>
        </span>
      </button>

      <button type="button" onClick={onFile}>
        <span className="cybrez-work-surface-menu-icon">□</span>
        <span>
          <strong>File</strong>
          <small>Attach relevant material <kbd>F</kbd></small>
        </span>
      </button>
    </div>
  );
}

function WorkBlockCard({
  block,
  readOnly,
  onEdit,
  onDelete,
  onToggle,
  onAddChecklistItem,
  onDragStart,
  style,
}: {
  block: WorkBlock;
  readOnly: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (itemId: string) => void;
  onAddChecklistItem: () => void;
  onDragStart: (event: React.PointerEvent<HTMLDivElement>) => void;
  style: { left: number; top: number };
}) {
  const checklistItems = block.checklistItems ?? [{
    id: block.id,
    text: block.title || "Checklist",
    completed: Boolean(block.completed),
  }];

  return (
    <article className="cybrez-work-block" style={style}>
      <div className="cybrez-work-block-header" onPointerDown={onDragStart}>
        <div className="cybrez-work-block-type">
          {block.type === "TEXT" && "Text"}
          {block.type === "CHECKLIST" && "Checklist"}
          {block.type === "LINK" && "Link"}
          {block.type === "FILE" && "File"}
        </div>

        {!readOnly && <div className="cybrez-work-block-actions">
          {block.type !== "FILE" && (
            <button type="button" onClick={onEdit}>
              Edit
            </button>
          )}

          <button type="button" onClick={onDelete}>
            Delete
          </button>
        </div>}
      </div>

      {block.type === "TEXT" && (
        <div className="cybrez-work-block-content cybrez-work-block-text">
          {block.content ? (
            block.content
          ) : readOnly ? (
            "No note content."
          ) : (
            <button type="button" onClick={onEdit}>
              Add text...
            </button>
          )}
        </div>
      )}

      {block.type === "CHECKLIST" && (
        <div className="cybrez-work-block-content">
          <strong className="cybrez-work-checklist-title">{block.title || "Checklist"}</strong>
          {checklistItems.map((item) => (
            <label className="cybrez-work-checklist-item" key={item.id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle(item.id)}
                disabled={readOnly}
              />
              <span className={item.completed ? "is-complete" : undefined}>{item.text}</span>
            </label>
          ))}
          {!readOnly && (
            <button className="cybrez-work-checklist-add" type="button" onClick={onAddChecklistItem}>
              + Add item
            </button>
          )}
        </div>
      )}

      {block.type === "LINK" && (
        <div className="cybrez-work-block-content">
          <a
            className="cybrez-work-link"
            href={block.url}
            target="_blank"
            rel="noreferrer"
          >
            <span>{block.title || block.url}</span>
            <span>↗</span>
          </a>
        </div>
      )}

      {block.type === "FILE" && (
        <div className="cybrez-work-block-content">
          <div className="cybrez-work-file">
            <span className="cybrez-work-file-icon">□</span>

            <div>
              <strong>{block.fileName}</strong>

              <span>{block.content}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function EditorModal({
  title,
  children,
  onClose,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="cybrez-work-surface-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="cybrez-work-surface-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="cybrez-work-surface-modal-header">
          <h3>{title}</h3>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cybrez-work-surface-modal-body">
          {children}
        </div>

        <div className="cybrez-work-surface-modal-footer">
          <button
            type="button"
            className="cybrez-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="cybrez-button cybrez-button-primary"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

