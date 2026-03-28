import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Hero() {
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

  const handleScroll = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, oklch(0.18 0.035 250) 0%, oklch(0.09 0.018 250) 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div
              className="fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-[0.2em] w-fit"
              style={{
                background: "oklch(0.75 0.12 75 / 0.15)",
                border: "1px solid oklch(0.75 0.12 75 / 0.4)",
                color: "oklch(0.88 0.14 85)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              PREMIUM PANEL SOLUTIONS
            </div>

            <h1
              className="fade-in-up font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground"
              style={{ transitionDelay: "0.1s" }}
            >
              The Most <span className="gold-text">Trusted</span>
              <br />
              Panel Seller
              <br />
              <span
                className="font-serif italic"
                style={{ color: "oklch(0.72 0.02 240)" }}
              >
                Online
              </span>
            </h1>

            <p
              className="fade-in-up text-base md:text-lg leading-relaxed max-w-md"
              style={{ color: "oklch(0.72 0.02 240)", transitionDelay: "0.2s" }}
            >
              Premium-grade panel packages for every need. Delivered fast,
              backed by 24/7 support, and trusted by thousands of satisfied
              customers worldwide.
            </p>

            <div
              className="fade-in-up flex flex-wrap gap-3"
              style={{ transitionDelay: "0.3s" }}
            >
              <Button
                data-ocid="hero.explore_panels.primary_button"
                onClick={() => handleScroll("#panels")}
                className="gold-gradient text-[oklch(0.09_0.018_250)] font-bold text-sm tracking-wide rounded-full px-8 py-3 h-auto hover:shadow-gold-lg transition-all duration-300 flex items-center gap-2"
              >
                EXPLORE PANELS <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                data-ocid="hero.contact_us.secondary_button"
                onClick={() => handleScroll("#contact")}
                variant="outline"
                className="font-bold text-sm tracking-wide rounded-full px-8 py-3 h-auto transition-all duration-300"
                style={{
                  borderColor: "oklch(0.75 0.12 75 / 0.6)",
                  color: "oklch(0.88 0.14 85)",
                }}
              >
                CONTACT US
              </Button>
            </div>

            <div
              className="fade-in-up flex items-center gap-6 pt-2"
              style={{ transitionDelay: "0.4s" }}
            >
              {[
                { value: "10K+", label: "Happy Clients" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold gold-text">
                    {stat.value}
                  </div>
                  <div
                    className="text-xs tracking-wide"
                    style={{ color: "oklch(0.72 0.02 240)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="fade-in-up relative rounded-2xl overflow-hidden"
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden gold-glow">
              <img
                src="/assets/generated/hero-panel-luxury.dim_900x700.jpg"
                alt="Luxury Panel"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.09 0.018 250 / 0.5) 0%, transparent 60%, oklch(0.09 0.018 250 / 0.3) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
