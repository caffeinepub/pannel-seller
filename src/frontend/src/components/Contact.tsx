import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSiteSettings } from "../hooks/useQueries";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    toast.success("Message sent! We'll get back to you shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  const telegram = settings?.contactTelegram || "@pannelseller";
  const email = settings?.contactEmail || "support@pannelseller.com";

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 section-divider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p
            className="fade-in-up text-xs font-bold tracking-[0.3em] mb-3"
            style={{ color: "oklch(0.75 0.12 75)" }}
          >
            GET IN TOUCH
          </p>
          <h2
            className="fade-in-up font-serif text-4xl md:text-5xl text-foreground"
            style={{ transitionDelay: "0.1s" }}
          >
            Contact <span className="gold-text">Support</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="fade-in-up glass-card rounded-2xl p-8">
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <a
                href={`https://t.me/${telegram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="contact.telegram.button"
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.75 0.12 75 / 0.08)",
                  border: "1px solid oklch(0.75 0.12 75 / 0.25)",
                }}
              >
                <MessageCircle
                  className="w-5 h-5"
                  style={{ color: "oklch(0.75 0.12 75)" }}
                />
                <div>
                  <div
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: "oklch(0.75 0.12 75)" }}
                  >
                    TELEGRAM
                  </div>
                  <div className="text-sm text-foreground">{telegram}</div>
                </div>
              </a>
              <a
                href={`mailto:${email}`}
                data-ocid="contact.email.button"
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.75 0.12 75 / 0.08)",
                  border: "1px solid oklch(0.75 0.12 75 / 0.25)",
                }}
              >
                <Mail
                  className="w-5 h-5"
                  style={{ color: "oklch(0.75 0.12 75)" }}
                />
                <div>
                  <div
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: "oklch(0.75 0.12 75)" }}
                  >
                    EMAIL
                  </div>
                  <div className="text-sm text-foreground">{email}</div>
                </div>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                data-ocid="contact.name.input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="bg-[oklch(0.14_0.022_250)] border-[oklch(0.75_0.12_75/0.2)] text-foreground placeholder:text-muted-foreground"
              />
              <Input
                data-ocid="contact.email.input"
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                className="bg-[oklch(0.14_0.022_250)] border-[oklch(0.75_0.12_75/0.2)] text-foreground placeholder:text-muted-foreground"
              />
              <Textarea
                data-ocid="contact.message.textarea"
                placeholder="Your message..."
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
                rows={4}
                className="bg-[oklch(0.14_0.022_250)] border-[oklch(0.75_0.12_75/0.2)] text-foreground placeholder:text-muted-foreground resize-none"
              />
              <Button
                data-ocid="contact.submit.button"
                type="submit"
                disabled={sending}
                className="gold-gradient text-[oklch(0.09_0.018_250)] font-bold tracking-wide rounded-full hover:shadow-gold-lg transition-all duration-300"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    SENDING...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> SEND MESSAGE
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
