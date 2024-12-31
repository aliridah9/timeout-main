import { useMemo, useRef } from "react";

export function useCountRendered() {
  const rendered = useRef(0);
  const increment = useMemo(() => {
    return throttle(() => {
      rendered.current++;
    }, 2);
  }, []);
  increment();
  return rendered.current;
}

function throttle(fn: () => void, ms: number) {
  let lastTime = 0;
  return () => {
    const now = Date.now();
    if (now - lastTime > ms) {
      lastTime = now;
      fn();
    }
  };
}
