import type {
  TasksByStatus,
} from "../types/dashboard";

type Props = {
  data: TasksByStatus[];
};

export default function TasksByStatusCard({
  data,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h2>Tasks by Status</h2>

      {data.map((item) => (
        <div
          key={item.status}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span>{item.status}</span>

          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  );
}