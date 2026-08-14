
import type { ReactNode } from "react";

import { Sidebar, Topbar } from "@/components/layout";

type Props = {
  children: ReactNode;
};

export default function AppShell({
  children,
}: Props) {
  return (
    <div className="cybrez-app-shell">
      <Sidebar />

      <div className="cybrez-main">
        <Topbar />

        <main className="cybrez-content">
          {children}
        </main>
      </div>
    </div>
  );
}

