import { useState, useEffect } from "react";

export default function BottomSheet({ isOpen, onClose, children }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let openRaf1;
    let openRaf2;
    let closeTimer;

    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      // 첫 프레임에 숨김 상태로 렌더한 뒤 다음 프레임에서 표시해야
      // 열릴 때 transform transition이 안정적으로 보인다.
      setVisible(false);
      openRaf1 = requestAnimationFrame(() => {
        openRaf2 = requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      closeTimer = setTimeout(() => setShouldRender(false), 320);
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
      {/* 앱 컨테이너 폭(모바일 프레임) 안에서만 오버레이/시트가 보이도록 중앙 고정 */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pointer-events-auto">
        {/*Dim Overlay*/}
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-450 ease-in-out"
          style={{ opacity: visible ? 1 : 0 }}
          onClick={onClose}
        />
        {/*Bottom Sheet Content*/}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] h-[min(92dvh,980px)] overflow-hidden transition-transform duration-600 ease-out"
          style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
