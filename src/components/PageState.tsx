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
    return <p>{loadingMessage}</p>;
  }

  if (error) {
    return <pre>{String(error)}</pre>;
  }

  if (empty) {
    return <p>{emptyMessage}</p>;
  }

  return <>{children}</>;
}
