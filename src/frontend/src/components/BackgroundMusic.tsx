import { useEffect, useRef } from "react";

const AUDIO_SRC =
  "/assets/uploads/elevenlabs_2026-03-29t21_08_45_roger_-_laid-back_casual_resonant_pre_sp73_s100_sb0_se0_b_m2-019d3b6e-eb6c-73c7-b8a1-1b3cde3ca6b7-1.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;

    // Try autoplay immediately
    audio.play().catch(() => {
      // Autoplay blocked — wait for first interaction
      const startAudio = () => {
        if (!startedRef.current && audioRef.current) {
          startedRef.current = true;
          audioRef.current.play().catch(() => {});
        }
        document.removeEventListener("click", startAudio);
        document.removeEventListener("touchstart", startAudio);
      };
      document.addEventListener("click", startAudio, { once: true });
      document.addEventListener("touchstart", startAudio, { once: true });
    });
  }, []);

  return (
    // biome-ignore lint/a11y/useMediaCaption: background music, no captions needed
    <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
  );
}
