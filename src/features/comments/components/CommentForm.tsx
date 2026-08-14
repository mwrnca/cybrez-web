import { useEffect, useState } from "react";

import type { Comment } from "../types/comment";

type Props = {
  initialData?: Comment;
  loading?: boolean;
  onSubmit: (
    data: {
      content: string;
    }
  ) => Promise<void>;
};

export default function CommentForm({
  initialData,
  loading = false,
  onSubmit,
}: Props) {
  const [content, setContent] = useState(
    initialData?.content ?? ""
  );

  useEffect(() => {
    setContent(initialData?.content ?? "");
  }, [initialData]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    await onSubmit({
      content: trimmed,
    });

    if (!initialData) {
      setContent("");
    }
  }

  const editing = Boolean(initialData);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <h2>
        {editing ? "Edit Comment" : "Add Comment"}
      </h2>

      <textarea
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        placeholder="Write a comment..."
        rows={5}
        disabled={loading}
        required
      />

      <button
        type="submit"
        disabled={
          loading || !content.trim()
        }
      >
        {loading
          ? editing
            ? "Saving..."
            : "Posting..."
          : editing
            ? "Save Changes"
            : "Add Comment"}
      </button>
    </form>
  );
}