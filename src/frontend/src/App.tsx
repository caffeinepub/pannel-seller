import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import BackgroundMusic from "./components/BackgroundMusic";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const isAdmin = route === "/admin" || route.startsWith("/admin");

  return (
    <>
      {isAdmin ? <Admin /> : <Home />}
      <BackgroundMusic />
      <Toaster richColors position="top-right" />
    </>
  );
}
