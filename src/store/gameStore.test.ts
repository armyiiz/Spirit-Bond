import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import { STARTERS } from '../data/monsters';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.setState({
      player: { name: 'Test Player', gold: 0, level: 1 },
      myMonster: null,
      inventory: [],
      lastSaveTime: Date.now()
    });
  });

  it('should start game with selected monster', () => {
    const starterId = STARTERS[0].speciesId;
    useGameStore.getState().startGame(starterId);

    const state = useGameStore.getState();
    expect(state.myMonster).toBeDefined();
    expect(state.myMonster?.speciesId).toBe(starterId);
    expect(state.myMonster?.vitals.hunger).toBe(100);
  });

  it('should update vitals', () => {
    useGameStore.getState().startGame(STARTERS[0].speciesId);

    useGameStore.getState().updateVitals({ hunger: -10 });
    expect(useGameStore.getState().myMonster?.vitals.hunger).toBe(90);

    useGameStore.getState().updateVitals({ hunger: 20 });
    expect(useGameStore.getState().myMonster?.vitals.hunger).toBe(100); // Cap at 100
  });

  it('should add and use items', () => {
    useGameStore.getState().startGame(STARTERS[0].speciesId);

    // Add item
    useGameStore.getState().addItem('food_apple', 1);
    expect(useGameStore.getState().inventory).toHaveLength(1);
    expect(useGameStore.getState().inventory[0].item.id).toBe('food_apple');

    // Reduce hunger first
    useGameStore.getState().updateVitals({ hunger: -50 });
    expect(useGameStore.getState().myMonster?.vitals.hunger).toBe(50);

    // Use item
    useGameStore.getState().useItem('food_apple');

    // Check effects (Apple: +10 Hunger)
    expect(useGameStore.getState().myMonster?.vitals.hunger).toBe(60);
    expect(useGameStore.getState().inventory).toHaveLength(0); // Should be empty
  });

  it('should train monster', () => {
    useGameStore.getState().startGame(STARTERS[0].speciesId);

    const initialStats = { ...useGameStore.getState().myMonster!.stats };
    const initialEnergy = useGameStore.getState().myMonster!.vitals.energy; // 100

    useGameStore.getState().trainMonster();

    const newState = useGameStore.getState();
    expect(newState.myMonster?.vitals.energy).toBe(initialEnergy - 20);

    // Check if at least one stat increased
    const stats = newState.myMonster!.stats;
    const hasIncreased = (
        stats.atk > initialStats.atk ||
        stats.def > initialStats.def ||
        stats.spd > initialStats.spd ||
        stats.hp > initialStats.hp
    );
    expect(hasIncreased).toBe(true);
  });
});
