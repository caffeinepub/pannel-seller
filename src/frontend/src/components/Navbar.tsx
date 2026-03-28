import { Button } from "@/components/ui/button";
import { Menu, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  onGetStarted?: () => void;
}

export default function Navbar({ onGetStarted }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleGetStarted = () => {
    setMobileOpen(false);
    onGetStarted?.();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.09_0.018_250/0.95)] shadow-[0_1px_0_oklch(0.75_0.12_75/0.25)] backdrop-blur-md"
          : "bg-[oklch(0.09_0.018_250/0.97)] backdrop-blur-md"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Shield
                className="w-8 h-8"
                style={{ color: "oklch(0.75 0.12 75)" }}
              />
              <span
                className="absolute inset-0 flex items-center justify-center text-[7px] font-bold"
                style={{ color: "oklch(0.09 0.018 250)", marginTop: "1px" }}
              >
                ✓
              </span>
            </div>
            <div className="leading-none">
              <div className="text-xs font-bold tracking-[0.2em] gold-text">
                TRUSTED
              </div>
              <div className="text-sm font-bold tracking-[0.12em] text-foreground">
                PANNEL SELLER
              </div>
            </div>
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              data-ocid="nav.get_started.button"
              onClick={handleGetStarted}
              className="hidden md:flex gold-gradient text-[oklch(0.09_0.018_250)] font-semibold text-sm tracking-wide rounded-full px-5 py-2 h-auto hover:shadow-gold transition-all duration-200"
            >
              GET STARTED
            </Button>
            <button
              type="button"
              data-ocid="nav.mobile_menu.toggle"
              className="md:hidden text-muted-foreground hover:text-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden pb-4 border-t"
            style={{ borderColor: "oklch(0.75 0.12 75 / 0.2)" }}
          >
            <div className="flex flex-col gap-1 pt-3">
              <Button
                onClick={handleGetStarted}
                className="mt-2 gold-gradient text-[oklch(0.09_0.018_250)] font-semibold rounded-full"
              >
                GET STARTED
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
