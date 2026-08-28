import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

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

  const {
    data,
    isLoading,
    isError,
    error,
  } = useComments(taskId ?? "");

  const [showForm, setShowForm] = useState(false);

  if (!taskId) {
    return (
      <PageState
        loading={false}
        empty={true}
        loadingMessage="Loading comments..."
        emptyMessage="Task not found."
      >
        <></>
      </PageState>
    );
  }

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      loadingMessage="Loading comments..."
    >
      <div
        style={{
          display: "grid",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <button
              onClick={() =>
                navigate(`/tasks/${taskId}`)
              }
            >
              Back to Task
            </button>

            <h1>Comments</h1>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              Task discussion
            </p>
          </div>

          <button
            className="cybrez-button cybrez-button-primary"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Close Form" : "+ Add Comment"}
          </button>
        </div>

        {showForm && (
          <CommentForm
            loading={createComment.isPending}
            onSubmit={async (formData) => {
              await createComment.mutateAsync({
                taskId,
                data: formData,
              });

              setShowForm(false);
            }}
          />
        )}

        <div>
          <h2>
            Total: {data?.length ?? 0}
          </h2>

          {(data?.length ?? 0) === 0 ? (
            <p style={{ color: "#6b7280" }}>
              No comments yet. Be the first to comment.
            </p>
          ) : (
            data?.map((comment) => (
              <div
                key={comment.public_id}
                style={{
                  border:
                    "1px solid #d1d5db",
                  padding: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                }}
              >
                <p>{comment.content}</p>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    onClick={() =>
                      navigate(
                        `/comments/${comment.public_id}`
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Delete this comment?"
                        )
                      ) {
                        deleteComment.mutate({
                          commentId:
                            comment.public_id,
                        });
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageState>
  );
}