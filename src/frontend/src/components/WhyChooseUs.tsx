import { Headphones, ShieldCheck, Star, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: ShieldCheck,
    title: "TRUSTED QUALITY",
    description:
      "Every panel is vetted and certified to the highest industry standards. Your satisfaction is guaranteed.",
  },
  {
    icon: Zap,
    title: "LIGHTNING FAST",
    description:
      "Instant delivery and activation. Get your panel up and running in minutes, not hours.",
  },
  {
    icon: Headphones,
    title: "24/7 SUPPORT",
    description:
      "Our expert support team is available around the clock to assist you with any questions.",
  },
  {
    icon: Star,
    title: "PREMIUM GRADE",
    description:
      "Enterprise-level performance and reliability, packaged for businesses of every size.",
  },
];

export default function WhyChooseUs() {
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
      id="why-us"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 section-divider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p
            className="fade-in-up text-xs font-bold tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.12 75)" }}
          >
            THE DIFFERENCE
          </p>
          <h2
            className="fade-in-up font-serif text-4xl md:text-5xl text-foreground"
            style={{ transitionDelay: "0.1s" }}
          >
            Why <span className="gold-text">Choose Us</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                data-ocid={`why_us.item.${i + 1}`}
                className="fade-in-up glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:-translate-y-1 gold-glow-hover"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.75 0.12 75 / 0.1)",
                    border: "1px solid oklch(0.75 0.12 75 / 0.3)",
                  }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: "oklch(0.75 0.12 75)" }}
                  />
                </div>
                <h3 className="text-sm font-bold tracking-[0.15em] text-foreground">
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.72 0.02 240)" }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
