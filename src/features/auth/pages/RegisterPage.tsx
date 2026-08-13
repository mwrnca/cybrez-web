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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        password,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1>Create Account</h1>

        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}