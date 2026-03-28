type Tab = "BUY" | "PROOFS" | "PANEL VIDEOS";

interface TabNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export type { Tab };

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabs: Tab[] = ["BUY", "PROOFS", "PANEL VIDEOS"];

  return (
    <div
      className="sticky z-40 bg-[oklch(0.09_0.018_250/0.97)] backdrop-blur-md border-b"
      style={{ top: "64px", borderColor: "oklch(0.75 0.12 75 / 0.18)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-ocid={`tab.${tab.toLowerCase().replace(" ", "_")}.tab`}
                onClick={() => onTabChange(tab)}
                className={`relative px-6 md:px-10 py-4 text-xs md:text-sm font-bold tracking-[0.18em] transition-all duration-200 ${
                  isActive
                    ? "text-[oklch(0.75_0.12_75)]"
                    : "text-muted-foreground hover:text-[oklch(0.85_0.08_75)]"
                }`}
              >
                {tab}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "oklch(0.75 0.12 75)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
