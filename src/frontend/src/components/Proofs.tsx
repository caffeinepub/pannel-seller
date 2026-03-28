import { ShieldCheck } from "lucide-react";

const proofImages = [
  "/assets/uploads/whatsapp_image_2026-03-28_at_10.00.00_pm-019d357f-b41f-7372-8124-569c5374a537-1.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-28_at_10.01.20_pm-019d357f-b6dd-756c-9d73-29caaa3098d6-2.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-28_at_10.01.19_pm-019d357f-b830-724b-9ee0-f2a4716bfbe9-3.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-28_at_10.01.21_pm-019d357f-b91a-7711-8049-871439aa797e-4.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-28_at_10.01.26_pm-019d357f-bb22-75dc-a717-a28262ab797b-5.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-28_at_10.00.01_pm-019d357f-bca3-709d-b1cd-9b26a22eef20-6.jpeg",
];

export default function Proofs() {
  return (
    <section
      id="proofs"
      className="min-h-[60vh] flex flex-col items-center py-16 px-4"
    >
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ background: "oklch(0.75 0.12 75 / 0.12)" }}
        >
          <ShieldCheck
            className="w-8 h-8"
            style={{ color: "oklch(0.75 0.12 75)" }}
          />
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-[0.12em] mb-2"
          style={{ color: "oklch(0.75 0.12 75)" }}
        >
          PROOFS
        </h2>
        <p className="text-muted-foreground text-sm tracking-wide">
          Real payment proofs from our satisfied customers
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {proofImages.map((src, i) => (
          <div
            key={src}
            className="rounded-xl overflow-hidden border"
            style={{
              borderColor: "oklch(0.75 0.12 75 / 0.25)",
              background: "oklch(0.12 0.01 75 / 0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <img
              src={src}
              alt={`Proof ${i + 1}`}
              className="w-full h-full object-cover"
              style={{ maxHeight: "320px" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
