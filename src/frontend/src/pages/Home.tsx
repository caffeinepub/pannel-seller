import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PanelVideos from "../components/PanelVideos";
import Products from "../components/Products";
import Proofs from "../components/Proofs";
import TabNav, { type Tab } from "../components/TabNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("BUY");

  return (
    <div className="relative min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* Full-screen video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        style={{ opacity: 0.45 }}
      >
        <source
          src="/assets/uploads/videoplayback-019d3b5d-9cc5-769c-adbc-cb4da31fdb75-1.mp4"
          type="video/mp4"
        />
      </video>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 z-[1]"
        style={{ background: "rgba(5,5,10,0.55)" }}
      />

      {/* Main content */}
      <div className="relative z-10">
        <Navbar onGetStarted={() => setActiveTab("BUY")} />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <main>
          {activeTab === "BUY" && <Products />}
          {activeTab === "PROOFS" && <Proofs />}
          {activeTab === "PANEL VIDEOS" && <PanelVideos />}
        </main>
        <Footer />
      </div>
    </div>
  );
}
