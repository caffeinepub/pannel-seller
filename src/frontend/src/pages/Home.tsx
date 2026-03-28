import { useState } from "react";
import Footer from "../components/Footer";
import LightningBackground from "../components/LightningBackground";
import Navbar from "../components/Navbar";
import PanelVideos from "../components/PanelVideos";
import Products from "../components/Products";
import Proofs from "../components/Proofs";
import TabNav, { type Tab } from "../components/TabNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("BUY");

  return (
    <div className="relative min-h-screen">
      <LightningBackground />
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
