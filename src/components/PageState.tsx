type Props = {
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  children: React.ReactNode;
};

export default function PageState({
  loading,
  error,
  empty,
  loadingMessage = "Loading...",
  emptyMessage = "No data available.",
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
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>Something went wrong</h2>
          <p>
            {typeof error === "object" && error !== null && "message" in error
              ? String((error as { message: string }).message)
              : String(error)}
          </p>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-empty-state cybrez-card">
          <div className="cybrez-empty-state-icon">Ø</div>
          <h3>No records found</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
