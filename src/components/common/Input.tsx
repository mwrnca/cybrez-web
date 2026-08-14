import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: Props) {
  return (
    <div style={{ display: "grid", gap: "0.4rem" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text-secondary)",
          }}
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`cybrez-input ${className}`.trim()}
        {...props}
      />

      {error && (
        <span
          style={{
            color: "var(--color-danger)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}