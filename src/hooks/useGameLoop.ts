import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export const useGameLoop = () => {
  const { myMonster, tick, wakeUp } = useGameStore();
  const isLoopInitialized = useRef(false);

  useEffect(() => {
    // We only want this effect to run ONCE, when the monster is loaded.
    // Using a ref prevents it from re-running on every myMonster state change.
    if (!myMonster || isLoopInitialized.current) return;

    // 1. On initial load, wake monster up (calculates all offline progress)
    // This action will update the monster's state, but the ref will prevent a loop.
    wakeUp();
    isLoopInitialized.current = true; // Mark as initialized

    // 2. Start the active game interval (tick)
    // This should only ever be set up once.
    const interval = setInterval(() => {
       tick();
    }, 10000); // 10s interval

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);

  // We intentionally use an empty dependency array `[]` to ensure this runs only ONCE.
  // We control the logic flow internally with the `myMonster` and `isLoopInitialized` checks.
  }, [myMonster, tick, wakeUp]);
};
