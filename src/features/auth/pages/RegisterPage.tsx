import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";

export default function RegisterPage() {
  const { register, authenticated } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await register({
        full_name: fullName,
        email,
        password,
      });
    } catch (err) {
      setError(
        typeof err === "object" && err !== null && "response" in err
          ? String((err as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Registration failed.")
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="cybrez-app-shell"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "var(--space-4)",
      }}
    >
      <div
        className="cybrez-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "var(--space-8)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <span className="cybrez-badge" style={{ marginBottom: "var(--space-2)" }}>
            Get started
          </span>
          <h1 style={{ fontSize: "var(--font-size-2xl)", marginTop: "var(--space-2)" }}>
            Create <span className="cybrez-gold">Account</span>
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", marginTop: "var(--space-1)" }}>
            Join CYBREZ and manage your workspaces.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "var(--space-4)" }}>
          {error && (
            <div
              style={{
                padding: "var(--space-3)",
                background: "var(--color-danger-soft)",
                color: "var(--color-danger)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              {error}
            </div>
          )}

          <div className="cybrez-form-field">
            <span style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-subtle)" }}>
              Full Name
            </span>
            <input
              type="text"
              className="cybrez-input"
              placeholder="Alex Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="cybrez-form-field">
            <span style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-subtle)" }}>
              Email Address
            </span>
            <input
              type="email"
              className="cybrez-input"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="cybrez-form-field">
            <span style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-subtle)" }}>
              Password
            </span>
            <input
              type="password"
              className="cybrez-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="cybrez-button cybrez-button-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "var(--space-2)" }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}