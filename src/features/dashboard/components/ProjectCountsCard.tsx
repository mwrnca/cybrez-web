import type {
  ProjectCount,
} from "../types/dashboard";

type Props = {
  data: ProjectCount[];
};

export default function ProjectCountsCard({
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
      <h2>Projects</h2>

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