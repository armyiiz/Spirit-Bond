import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useGameLoop = () => {
  const { myMonster, updateVitals, lastSaveTime, setLastSaveTime, tick } = useGameStore();

  useEffect(() => {
    if (!myMonster) return;

    // 1. Calculate Offline Progress
    const now = Date.now();
    const timeDiffMs = now - lastSaveTime;
    const minutesPassed = Math.floor(timeDiffMs / (1000 * 60));

    // Hunger drops 5 units every 30 minutes
    // Mood drops 5 units every 60 minutes
    // Energy recovers 10 units every 60 minutes

    const hungerDrop = Math.floor(minutesPassed * (5 / 30));
    const moodDrop = Math.floor(minutesPassed * (5 / 60));
    const energyGain = Math.floor(minutesPassed * (10 / 60));

    if (hungerDrop > 0 || moodDrop > 0 || energyGain > 0) {
      console.log(`Offline for ${minutesPassed} mins. Hunger -${hungerDrop}, Mood -${moodDrop}, Energy +${energyGain}`);
      updateVitals({
        hunger: -hungerDrop,
        mood: -moodDrop,
        energy: energyGain
      });
    }

    setLastSaveTime(Date.now());

    // 2. Start Active Interval (10 seconds)
    const interval = setInterval(() => {
       const currentNow = Date.now();
       setLastSaveTime(currentNow);

       // Trigger Game Tick (Regen, Decay, Poop)
       tick();

    }, 10000); // 10s interval

    return () => clearInterval(interval);
  }, [myMonster]);
};
