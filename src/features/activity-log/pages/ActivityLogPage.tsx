import { useParams } from "react-router-dom";

import { ActivityLogList } from "../components";
import { useActivityLogs } from "../hooks";

export default function ActivityLogPage() {
 

const { organizationId } = useParams();

console.log("ActivityLogPage organizationId:", organizationId);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useActivityLogs(
    organizationId!
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Activity Log</h1>

      <ActivityLogList
        logs={data ?? []}
      />
    </div>
  );
}