import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import PageState from "@/components/PageState";
import {
  useComment,
  useUpdateComment,
  useDeleteComment,
} from "../hooks";
import { CommentForm } from "../components";
import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

export default function CommentPage() {
  const { commentId } = useParams();
  const navigate = useNavigate();

  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const {
  data: comment,
  isLoading,
  isError,
  error,
} = useComment(commentId!);

  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!comment}
      loadingMessage="Loading comment..."
      emptyMessage="Comment not found."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <h1>Comment</h1>

          <button
            className="cybrez-button cybrez-button-secondary"
            onClick={() => setShowEditForm((v) => !v)}
          >
            {showEditForm ? "Close" : "Edit"}
          </button>
        </div>

        {!showEditForm && comment && (
          <p style={{ whiteSpace: "pre-wrap" }}>{comment.content}</p>
        )}

        {showEditForm && (
          <CommentForm
            initialData={comment}
            loading={updateComment.isPending}
            onSubmit={async (data) => {
              await updateComment.mutateAsync({
                commentId: comment!.public_id,
                data,
              });

              setShowEditForm(false);
            }}
          />
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>

        <PermissionGate minimumRole={PERMISSIONS.manageComments}>
          <button
            onClick={() => {
              if (window.confirm("Delete this comment?")) {
                deleteComment.mutate({ commentId: comment!.public_id });
              }
            }}
          >
            Delete
          </button>
        </PermissionGate>


        <PermissionGate minimumRole={PERMISSIONS.manageComments}>
          <button onClick={() => navigate(-1)}>Back</button>
        </PermissionGate>

        </div>
      </div>
    </PageState>
  );
}