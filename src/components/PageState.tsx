import { formatUserFacingError } from "@/utils/errorUtils";

type Props = {
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
};

export default function PageState({
  loading,
  error,
  empty,
  loadingMessage = "Loading...",
  emptyTitle = "No records found",
  emptyMessage = "No data available.",
  errorTitle = "Something went wrong",
  errorMessage,
  onRetry,
  children,
}: Props) {
  if (loading) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state">
          <div className="cybrez-loading-indicator" />
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const displayMessage = errorMessage ?? formatUserFacingError(error);

    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>{errorTitle}</h2>
          <p>{displayMessage}</p>
          {onRetry && (
            <button
              className="cybrez-button cybrez-button-secondary"
              style={{ marginTop: "var(--space-3)" }}
              onClick={onRetry}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-empty-state cybrez-card">
          <div className="cybrez-empty-state-icon">Ø</div>
          <h3>{emptyTitle}</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

