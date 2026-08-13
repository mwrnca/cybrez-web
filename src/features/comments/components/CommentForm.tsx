import { useState } from "react";

type Props = {
  loading?: boolean;
  onSubmit: (
    data: {
      content: string;
    }
  ) => Promise<void>;
};

export default function CommentForm({
  loading = false,
  onSubmit,
}: Props) {
  const [content, setContent] = useState("");

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

    setContent("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <h2>Add Comment</h2>

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
          ? "Posting..."
          : "Add Comment"}
      </button>
    </form>
  );
}