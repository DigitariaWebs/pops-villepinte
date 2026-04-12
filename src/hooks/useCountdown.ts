import { useEffect, useRef, useState } from "react";

export type CountdownResult = {
  minutes: number;
  seconds: number;
  /** 0 = just placed, 1 = time's up. */
  progress: number;
  isExpired: boolean;
  totalRemainingMs: number;
};

function calc(created: number, target: number): CountdownResult {
  const totalWindow = target - created;
  const now = Date.now();
  const remaining = Math.max(0, target - now);
  const elapsed = now - created;
  const progress = totalWindow > 0 ? Math.min(1, elapsed / totalWindow) : 1;
  const totalSec = Math.ceil(remaining / 1000);
  return {
    minutes: Math.floor(totalSec / 60),
    seconds: totalSec % 60,
    progress,
    isExpired: remaining <= 0,
    totalRemainingMs: remaining,
  };
}

export function useCountdown(
  createdAt: string,
  estimatedReadyAt: string,
): CountdownResult {
  const created = useRef(new Date(createdAt).getTime()).current;
  const target = useRef(new Date(estimatedReadyAt).getTime()).current;

  const [state, setState] = useState<CountdownResult>(() =>
    calc(created, target),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setState(calc(created, target));
    }, 1000);
    return () => clearInterval(id);
  }, [created, target]);

  return state;
}
