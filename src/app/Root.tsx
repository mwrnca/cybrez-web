import Providers from "./providers";
import AppRoutes from "@/routes/AppRoutes";

export default function Root() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}