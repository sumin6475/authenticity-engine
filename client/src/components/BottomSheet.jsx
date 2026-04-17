import { useState, useEffect } from "react";

export default function BottomSheet({ isOpen, onClose, children }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const SHEET_ANIMATION_MS = 800;

  useEffect(() => {
    let openRaf1;
    let openRaf2;
    let closeTimer;

    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      setVisible(false);
      openRaf1 = requestAnimationFrame(() => {
        openRaf2 = requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      closeTimer = setTimeout(() => setShouldRender(false), SHEET_ANIMATION_MS);
      document.body.style.overflow = "unset";
    }

    return () => {
      if (openRaf1) cancelAnimationFrame(openRaf1);
      if (openRaf2) cancelAnimationFrame(openRaf2);
      if (closeTimer) clearTimeout(closeTimer);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!shouldRender) return null;
  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pointer-events-auto">
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-450 ease-in-out"
          style={{ opacity: visible ? 1 : 0 }}
          onClick={onClose}
        />
        <div
          className="absolute bottom-0 left-0 right-0 bg-ae-surface rounded-t-2xl shadow-ae-card h-[min(92dvh,980px)] overflow-hidden transition-transform transition-opacity duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: visible ? "translateY(0)" : "translateY(104%)",
            opacity: visible ? 1 : 0.98,
            willChange: "transform, opacity",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
