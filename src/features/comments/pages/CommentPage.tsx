import { useNavigate, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import { useComments, useUpdateComment, useDeleteComment } from "../hooks";
import { CommentForm } from "../components";

export default function CommentPage() {
  const { commentId } = useParams();
  const navigate = useNavigate();

  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const { data, isLoading, isError, error } = useComments(commentId!);

  const comment = data?.find((item) => item.public_id === commentId);

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!comment}
      loadingMessage="Loading comment..."
      emptyMessage="Comment not found."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <h1>Comment</h1>

        <CommentForm
          initialData={comment}
          loading={updateComment.isPending}
          onSubmit={async (data) => {
            await updateComment.mutateAsync({
              commentId: comment!.public_id,
              data,
            });
          }}
        />

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => {
              if (window.confirm("Delete this comment?")) {
                deleteComment.mutate({ commentId: comment!.public_id });
              }
            }}
          >
            Delete
          </button>

          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </PageState>
  );
}
