import { PlayCircle } from "lucide-react";
import { useState } from "react";

const GOLD = "oklch(0.75 0.12 75)";
const GOLD_BG = "oklch(0.75 0.12 75 / 0.12)";
const GOLD_BORDER = "oklch(0.75 0.12 75 / 0.35)";

export default function PanelVideos() {
  const [activeTab, setActiveTab] = useState<"MAIN ID" | "NOOB ID" | null>(
    null,
  );
  const [subTab, setSubTab] = useState<"MAIN ID" | "NOOB ID">("MAIN ID");

  return (
    <section
      id="panel-videos"
      className="min-h-[60vh] flex flex-col items-center py-24 px-4"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ background: GOLD_BG }}
        >
          <PlayCircle className="w-8 h-8" style={{ color: GOLD }} />
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-[0.12em] mb-4"
          style={{ color: GOLD }}
        >
          PANEL VIDEOS
        </h2>
      </div>

      {/* Panel Video Cards */}
      {activeTab === null && (
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center">
          {(["MAIN ID", "NOOB ID"] as const).map((label) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                setActiveTab(label);
                setSubTab(label);
              }}
              className="flex-1 rounded-2xl p-8 text-center font-bold text-lg tracking-widest transition-all duration-200 cursor-pointer"
              style={{
                background: GOLD_BG,
                border: `1.5px solid ${GOLD_BORDER}`,
                color: GOLD,
                letterSpacing: "0.18em",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-section view */}
      {activeTab !== null && (
        <div className="w-full max-w-3xl">
          {/* Back + sub-tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab(null)}
              className="text-sm tracking-widest px-4 py-2 rounded-lg transition-colors"
              style={{
                color: GOLD,
                border: `1px solid ${GOLD_BORDER}`,
                background: GOLD_BG,
              }}
            >
              ← BACK
            </button>
            {(["MAIN ID", "NOOB ID"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setSubTab(tab)}
                className="px-6 py-2 rounded-lg font-bold tracking-widest text-sm transition-all duration-200"
                style={{
                  background: subTab === tab ? GOLD : GOLD_BG,
                  color: subTab === tab ? "oklch(0.1 0 0)" : GOLD,
                  border: `1.5px solid ${GOLD_BORDER}`,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* MAIN ID content */}
          {subTab === "MAIN ID" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: `1.5px solid ${GOLD_BORDER}` }}
              >
                <img
                  src="/assets/uploads/img-20260328-wa0031-019d356d-67d5-764e-b711-0f5519c179de-1.jpg"
                  alt="Main ID proof"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: `1.5px solid ${GOLD_BORDER}` }}
              >
                {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded panel proof video */}
                <video
                  src="/assets/uploads/vid-20260328-wa0037-019d356d-7d22-72ae-8dbe-28497fef7081-1.mp4"
                  controls
                  className="w-full h-full object-cover"
                  style={{ minHeight: "200px" }}
                />
              </div>
            </div>
          )}

          {/* NOOB ID content */}
          {subTab === "NOOB ID" && (
            <div className="grid grid-cols-1 gap-6">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: `1.5px solid ${GOLD_BORDER}` }}
              >
                {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded noob id panel proof video */}
                <video
                  src="/assets/uploads/vid-20260328-wa0034-019d3572-fe57-73dc-8435-ad1d5728b3b4-1.mp4"
                  controls
                  className="w-full object-cover"
                  style={{ minHeight: "300px" }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
