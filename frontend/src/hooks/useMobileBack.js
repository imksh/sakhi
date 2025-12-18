import { useEffect } from "react";

export function useMobileBack(onBack) {
  useEffect(() => {
    // Push a dummy state so back triggers popstate
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      onBack();

      // Prevent actual navigation
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack]);
}