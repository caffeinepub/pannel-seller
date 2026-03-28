import { Quote } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Testimonial } from "../backend";
import { useActiveTestimonials } from "../hooks/useQueries";

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    customerId: BigInt(1),
    author: "Marcus Reynolds",
    role: "Digital Entrepreneur",
    content:
      "Absolutely blown away by the quality of the Elite Panel. Everything works flawlessly and the support team responded within minutes. This is the gold standard of panel services.",
    rating: BigInt(5),
    isActive: true,
    createdAt: BigInt(0),
  },
  {
    customerId: BigInt(2),
    author: "Sophia Chen",
    role: "E-Commerce Manager",
    content:
      "Switched from three different providers and nothing comes close. The Pro Panel has everything I need at a price that can't be beat. Highly recommend to any serious business owner.",
    rating: BigInt(5),
    isActive: true,
    createdAt: BigInt(0),
  },
  {
    customerId: BigInt(3),
    author: "James Whitfield",
    role: "Tech Agency Owner",
    content:
      "Our whole team uses Premium Panel now. Setup was instant, uptime has been perfect, and the API access opened up so many possibilities. Worth every penny and more.",
    rating: BigInt(5),
    isActive: true,
    createdAt: BigInt(0),
  },
];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {STAR_KEYS.map((k, i) => (
        <svg
          key={k}
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill={i < rating ? "oklch(0.88 0.14 85)" : "oklch(0.3 0 0)"}
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const { data: testimonials } = useActiveTestimonials();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.05 },
    );
    for (const c of el.querySelectorAll(".fade-in-up")) observer.observe(c);
    return () => observer.disconnect();
  }, []);

  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : FALLBACK_TESTIMONIALS;

  return (
    <section
      id="testimonials"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 section-divider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p
            className="fade-in-up text-xs font-bold tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.12 75)" }}
          >
            CLIENT STORIES
          </p>
          <h2
            className="fade-in-up font-serif text-4xl md:text-5xl text-foreground"
            style={{ transitionDelay: "0.1s" }}
          >
            What Our <span className="gold-text">Clients Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayTestimonials.map((t, i) => (
            <div
              key={t.customerId.toString()}
              data-ocid={`testimonials.item.${i + 1}`}
              className="fade-in-up glass-card rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 gold-glow-hover"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <Quote
                className="w-8 h-8 opacity-40"
                style={{ color: "oklch(0.75 0.12 75)" }}
              />
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "oklch(0.72 0.02 240)" }}
              >
                "{t.content}"
              </p>
              <div
                className="pt-2 border-t"
                style={{ borderColor: "oklch(0.75 0.12 75 / 0.15)" }}
              >
                <StarRating rating={Number(t.rating)} />
                <div className="mt-2">
                  <div className="text-sm font-bold text-foreground">
                    {t.author}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.72 0.02 240)" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
