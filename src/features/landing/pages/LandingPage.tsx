import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🏢",
    title: "Organizations & Roles",
    description:
      "Create workspaces for every team, with a five-tier role hierarchy from Owner down to Viewer.",
  },
  {
    icon: "📋",
    title: "Projects & Tasks",
    description:
      "Break work into projects and tasks, track status and priority, and keep everything organized.",
  },
  {
    icon: "✉️",
    title: "Team Invitations",
    description:
      "Bring people into an organization with role-based invitations and instant in-app notifications.",
  },
  {
    icon: "📊",
    title: "Activity Tracking",
    description:
      "See exactly what changed and when, across every project and organization you belong to.",
  },
];

export default function LandingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* NAV */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-5) var(--space-6)",
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            fontSize: "var(--font-size-xl)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          <span className="cybrez-gold">CYBREZ</span>
        </span>

        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Link
            to="/login"
            className="cybrez-button cybrez-button-ghost"
            style={{ textDecoration: "none" }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="cybrez-button cybrez-button-primary"
            style={{ textDecoration: "none" }}
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "var(--space-8) var(--space-6) var(--space-6)",
          maxWidth: "780px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <span
          className="cybrez-badge"
          style={{ marginBottom: "var(--space-4)" }}
        >
          Multi-organization workspace
        </span>

        <h1
          style={{
            fontSize: "var(--font-size-3xl, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginTop: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          Run every organization, project, and
          team from <span className="cybrez-gold">one place</span>.
        </h1>

        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-md, 1.1rem)",
            lineHeight: 1.6,
            marginBottom: "var(--space-6)",
          }}
        >
          CYBREZ brings organizations, projects, tasks, and your team
          together with clear roles, real-time activity tracking, and
          invitations that just work.
        </p>

        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/register"
            className="cybrez-button cybrez-button-primary"
            style={{ textDecoration: "none", padding: "0.85rem 1.75rem" }}
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="cybrez-button cybrez-button-secondary"
            style={{ textDecoration: "none", padding: "0.85rem 1.75rem" }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          padding: "var(--space-6)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          alignItems: "start",
          gap: "var(--space-4)",
        }}
      >
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="cybrez-card"
            style={{ padding: "var(--space-5)" }}
          >
            <div style={{ fontSize: "1.75rem", marginBottom: "var(--space-2)" }}>
              {feature.icon}
            </div>
            <h3 style={{ marginBottom: "var(--space-2)" }}>
              {feature.title}
            </h3>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-sm)",
                lineHeight: 1.5,
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "var(--space-6)",
          marginTop: "auto",
          color: "var(--color-text-subtle)",
          fontSize: "var(--font-size-xs)",
        }}
      >
        © {new Date().getFullYear()} CYBREZ. All rights reserved.
      </footer>
    </div>
  );
}