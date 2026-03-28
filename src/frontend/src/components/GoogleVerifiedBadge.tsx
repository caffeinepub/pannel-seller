import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

export default function GoogleVerifiedBadge() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    for (const c of el.querySelectorAll(".fade-in-up")) observer.observe(c);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-6 section-divider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fade-in-up glass-card rounded-2xl px-6 py-5 flex flex-wrap items-center justify-center gap-6 md:gap-12 gold-glow">
          {/* Google Logo + Verified */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: "white" }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC05 50%, #FBBC05 75%, #34A853 75%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "'Product Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                G
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-foreground">
                  Google
                </span>
                <CheckCircle className="w-4 h-4" style={{ color: "#34A853" }} />
              </div>
              <div
                className="text-xs font-semibold tracking-wide"
                style={{ color: "#34A853" }}
              >
                Verified Business
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden md:block w-px h-10"
            style={{ background: "oklch(0.75 0.12 75 / 0.3)" }}
          />

          {/* Stars + Reviews */}
          <div className="flex items-center gap-3">
            <div>
              <div
                className="flex items-center gap-0.5"
                aria-label="5 out of 5 stars"
              >
                {STAR_KEYS.map((k) => (
                  <svg
                    key={k}
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="oklch(0.88 0.14 85)"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs font-semibold gold-text">4.9 / 5.0</div>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-foreground">
                500+ Reviews
              </div>
              <div
                className="text-xs"
                style={{ color: "oklch(0.72 0.02 240)" }}
              >
                Verified Customers
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden md:block w-px h-10"
            style={{ background: "oklch(0.75 0.12 75 / 0.3)" }}
          />

          {/* Trust badges */}
          <div className="flex items-center gap-4">
            {[
              { color: "#4285F4", label: "Secure" },
              { color: "#34A853", label: "Trusted" },
              { color: "#FBBC05", label: "Certified" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: badge.color }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.72 0.02 240)" }}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
