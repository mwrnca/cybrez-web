import { useParams } from "react-router-dom";

import { useRecentActivity } from "@/features/activity-log/hooks";

export default function RecentActivity() {
  const { organizationId } = useParams();

  const {
    data,
    isLoading,
  } = useRecentActivity(
    organizationId ?? ""
  );

  if (!organizationId) {
    return (
      <div>
        <h2>Recent Activity</h2>
        <p>Select an organization.</p>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading activity...</p>;
  }

  return (
    <div
      style={{
        marginTop: "2rem",
      }}
    >
      <h2>Recent Activity</h2>

      <ul>
        {data?.slice(0, 10).map((item) => (
          <li key={item.public_id}>
            <strong>{item.action}</strong>

            {" — "}

            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}