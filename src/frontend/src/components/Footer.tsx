import { Shield } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseEnterGold = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = "oklch(0.75 0.12 75)";
  };
  const handleMouseLeaveGray = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = "oklch(0.72 0.02 240)";
  };
  const handleMouseEnterGoldDim = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = "oklch(0.75 0.12 75)";
  };
  const handleMouseLeaveDim = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = "oklch(0.5 0.02 240)";
  };

  return (
    <footer
      className="py-12 section-divider"
      style={{ background: "oklch(0.08 0.015 250)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Nav Links */}
          <div>
            <h4
              className="text-xs font-bold tracking-[0.2em] mb-4"
              style={{ color: "oklch(0.75 0.12 75)" }}
            >
              QUICK LINKS
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Home", href: "#home" },
                { label: "Panels", href: "#panels" },
                { label: "Why Us", href: "#why-us" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    data-ocid={`footer.${link.label.toLowerCase()}.link`}
                    onClick={() => handleNav(link.href)}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "oklch(0.72 0.02 240)" }}
                    onMouseEnter={handleMouseEnterGold}
                    onMouseLeave={handleMouseLeaveGray}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Center */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <Shield
                className="w-8 h-8"
                style={{ color: "oklch(0.75 0.12 75)" }}
              />
              <div className="leading-none">
                <div className="text-xs font-bold tracking-[0.2em] gold-text">
                  TRUSTED
                </div>
                <div className="text-sm font-bold tracking-[0.12em] text-foreground">
                  PANNEL SELLER
                </div>
              </div>
            </div>
            <p
              className="text-xs max-w-xs"
              style={{ color: "oklch(0.72 0.02 240)" }}
            >
              The most trusted premium panel seller, delivering excellence and
              reliability to businesses worldwide.
            </p>
          </div>

          {/* Contact Info */}
          <div className="md:text-right">
            <h4
              className="text-xs font-bold tracking-[0.2em] mb-4"
              style={{ color: "oklch(0.75 0.12 75)" }}
            >
              CONTACT
            </h4>
            <ul className="flex flex-col gap-2">
              <li className="text-sm" style={{ color: "oklch(0.72 0.02 240)" }}>
                Telegram: @pannelseller
              </li>
              <li className="text-sm" style={{ color: "oklch(0.72 0.02 240)" }}>
                Email: support@pannelseller.com
              </li>
              <li className="text-sm" style={{ color: "oklch(0.72 0.02 240)" }}>
                Support: 24/7
              </li>
            </ul>
            <div className="mt-4">
              <button
                type="button"
                data-ocid="footer.admin.link"
                onClick={() => {
                  window.history.pushState({}, "", "/admin");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="text-xs transition-colors duration-200"
                style={{ color: "oklch(0.5 0.02 240)" }}
                onMouseEnter={handleMouseEnterGoldDim}
                onMouseLeave={handleMouseLeaveDim}
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>

        <div
          className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderColor: "oklch(0.75 0.12 75 / 0.1)",
            color: "oklch(0.5 0.02 240)",
          }}
        >
          <span>© {year} Pannel Seller. All rights reserved.</span>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
            style={{ color: "oklch(0.5 0.02 240)" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
