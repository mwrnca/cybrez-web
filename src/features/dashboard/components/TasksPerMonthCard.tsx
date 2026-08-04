import type {
  TasksPerMonth,
} from "../types/dashboard";

type Props = {
  data: TasksPerMonth[];
};

export default function TasksPerMonthCard({
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
      <h2>Tasks per Month</h2>

      {data.map((item) => (
        <div
          key={item.month}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span>{item.month}</span>

          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  );
}