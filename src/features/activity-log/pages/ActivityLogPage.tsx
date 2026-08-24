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
  } = useActivityLogs(
    organizationId!
  );

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!isLoading && !isError && (data?.length ?? 0) === 0}
      emptyMessage="No activity yet."
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