import { useParams } from "react-router-dom";
import { ActivityLogList } from "../components";
import { useActivityLogs } from "../hooks";
import PageState from "@/components/PageState";

export default function ActivityLogPage() {
  const { organizationId } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useActivityLogs(
    organizationId!
  );

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!isLoading && !isError && (data?.length ?? 0) === 0}
      loadingMessage="Loading activity log..."
      emptyTitle="No activity recorded"
      emptyMessage="Actions performed in this workspace will appear here chronologically."
      errorTitle="Unable to load activity log"
      onRetry={() => refetch()}
    >
      <div style={{ padding: "2rem" }}>
        <h1>Activity Log</h1>
        <ActivityLogList
          logs={data ?? []}
        />
      </div>
    </PageState>
  );
}