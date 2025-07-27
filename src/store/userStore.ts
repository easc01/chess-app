import { create } from 'zustand';
import { User, UserStats } from '@/lib/schema';
import { loadUser, saveUser, loadUserStats, saveUserStats } from '../utils/storage';
import { generateRandomName } from '../utils/nameGenerator';

interface UserStore {
  user: User | null;
  stats: UserStats | null;
  isInitialized: boolean;
  needsNameInput: boolean;
  
  // Actions
  initializeUser: () => Promise<void>;
  createNewUser: (name: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  updateStats: (gameResult: 'win' | 'loss' | 'draw', score: number) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  stats: null,
  isInitialized: false,
  needsNameInput: false,

  initializeUser: async () => {
    const user = await loadUser();
    
    if (!user) {
      // No user found, need to prompt for name
      set({ isInitialized: true, needsNameInput: true });
      return;
    }

    let stats = await loadUserStats(user.id);
    if (!stats) {
      stats = {
        userId: user.id,
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        bestScore: 0,
        avgScore: 0,
        currentStreak: 0,
        bestStreak: 0,
      };
      await saveUserStats(stats);
    }

    set({ user, stats, isInitialized: true, needsNameInput: false });
  },

  createNewUser: async (name: string) => {
    const user = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
    };
    await saveUser(user);

    const stats = {
      userId: user.id,
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      bestScore: 0,
      avgScore: 0,
      currentStreak: 0,
      bestStreak: 0,
    };
    await saveUserStats(stats);

    set({ user, stats, needsNameInput: false });
  },

  updateUserName: async (name: string) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, name };
    await saveUser(updatedUser);
    set({ user: updatedUser });
  },

  updateStats: async (gameResult: 'win' | 'loss' | 'draw', score: number) => {
    const { stats } = get();
    if (!stats) return;

    const newStats = { ...stats };
    newStats.totalGames++;
    
    if (gameResult === 'win') {
      newStats.wins++;
      newStats.currentStreak++;
      newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
    } else if (gameResult === 'loss') {
      newStats.losses++;
      newStats.currentStreak = 0;
    } else {
      newStats.draws++;
      newStats.currentStreak = 0;
    }

    newStats.bestScore = Math.max(newStats.bestScore, score);
    newStats.avgScore = Math.round(
      (newStats.avgScore * (newStats.totalGames - 1) + score) / newStats.totalGames
    );

    await saveUserStats(newStats);
    set({ stats: newStats });
  },
}));
