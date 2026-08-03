import { useNavigate, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
} from "../hooks";
import { CommentForm } from "../components";

export default function CommentsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const { data, isLoading, isError, error } = useComments(taskId!);

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!data || data.length === 0}
      loadingMessage="Loading comments..."
      emptyMessage="No comments yet. Start the discussion below."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <h1>Comments</h1>
          <p style={{ color: "#6b7280", marginTop: "0.35rem" }}>
            Track task discussion directly from the work item.
          </p>
        </div>

        <CommentForm
          loading={createComment.isPending}
          onSubmit={async (data) => {
            await createComment.mutateAsync({
              taskId: taskId!,
              data,
            });
          }}
        />

        <div>
          <h2>Total: {data?.length ?? 0}</h2>

          {data?.map((comment) => (
            <div
              key={comment.public_id}
              style={{
                border: "1px solid #d1d5db",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <p>{comment.content}</p>
              <small>{comment.public_id}</small>
              <br />
              <br />
              <button onClick={() => navigate(`/comments/${comment.public_id}`)}>View</button>
              <button
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  if (window.confirm("Delete this comment?")) {
                    deleteComment.mutate({ commentId: comment.public_id });
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageState>
  );
}
