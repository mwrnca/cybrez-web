import { useEffect, useState } from "react";

import type {
  Comment,
  CreateCommentRequest,
} from "../types/comment";

type Props = {
  initialData?: Comment;
  loading?: boolean;
  onSubmit: (data: CreateCommentRequest) => Promise<void>;
};

export default function CommentForm({
  initialData,
  loading,
  onSubmit,
}: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
    }
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit({ content });

    if (!initialData) {
      setContent("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Write a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />

      <br />
      <br />

      <button type="submit" disabled={loading}>
        {initialData ? "Update comment" : "Add comment"}
      </button>
    </form>
  );
}
