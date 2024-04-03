import React, { useLayoutEffect, useEffect, useState } from "react";

export default function useWindowPosition() {
  const canUseDOM: boolean = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  const [scrollPosition, setPosition] = useState(0);

  useIsomorphicLayoutEffect(() => {
    function updatePosition() {
      setPosition(window.scrollY);
    }
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
}
