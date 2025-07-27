import { User, UserStats, GameHistory, InsertGameHistory } from '@/lib/schema';

const STORAGE_KEYS = {
  USER: 'monochess-user',
  USER_STATS: 'monochess-user-stats',
  GAME_HISTORY: 'monochess-game-history',
};

// User storage
export const saveUser = async (user: User): Promise<void> => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
};

export const loadUser = async (): Promise<User | null> => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userData) return null;

  try {
    const parsed = JSON.parse(userData);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  } catch {
    return null;
  }
};

// User stats storage
export const saveUserStats = async (stats: UserStats): Promise<void> => {
  localStorage.setItem(`${STORAGE_KEYS.USER_STATS}-${stats.userId}`, JSON.stringify(stats));
};

export const loadUserStats = async (userId: string): Promise<UserStats | null> => {
  const statsData = localStorage.getItem(`${STORAGE_KEYS.USER_STATS}-${userId}`);
  if (!statsData) return null;

  try {
    return JSON.parse(statsData);
  } catch {
    return null;
  }
};

// Game history storage
export const saveGameHistory = async (gameData: InsertGameHistory): Promise<void> => {
  const history = await loadGameHistory(gameData.userId);
  
  const newGame: GameHistory = {
    id: crypto.randomUUID(),
    ...gameData,
  };

  const updatedHistory = [newGame, ...history].slice(0, 50); // Keep last 50 games
  
  localStorage.setItem(
    `${STORAGE_KEYS.GAME_HISTORY}-${gameData.userId}`,
    JSON.stringify(updatedHistory.map(game => ({
      ...game,
      startTime: game.startTime.toISOString(),
      endTime: game.endTime.toISOString(),
    })))
  );
};

export const loadGameHistory = async (userId: string): Promise<GameHistory[]> => {
  const historyData = localStorage.getItem(`${STORAGE_KEYS.GAME_HISTORY}-${userId}`);
  if (!historyData) return [];

  try {
    const parsed = JSON.parse(historyData);
    return parsed.map((game: any) => ({
      ...game,
      startTime: new Date(game.startTime),
      endTime: new Date(game.endTime),
    }));
  } catch {
    return [];
  }
};

export const clearUserData = async (userId: string): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(`${STORAGE_KEYS.USER_STATS}-${userId}`);
  localStorage.removeItem(`${STORAGE_KEYS.GAME_HISTORY}-${userId}`);
};
