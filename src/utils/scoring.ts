import { GameState, GameMove, Difficulty } from '@/lib/schema';

const PIECE_VALUES = {
  p: 100,
  n: 300,
  b: 300,
  r: 500,
  q: 900,
  k: 0,
};

const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  easy: 1.0,
  medium: 1.2,
  hard: 1.5,
};

export const calculateScore = (gameState: GameState, lastMove: GameMove): number => {
  let score = gameState.score;

  // Bonus for capturing pieces
  if (lastMove.captured) {
    const captureBonus = PIECE_VALUES[lastMove.captured.type] * 2;
    score += captureBonus;
  }

  // Bonus for moving certain pieces (development)
  if (lastMove.piece.type === 'k' || lastMove.piece.type === 'b') {
    score += 50;
  }

  // Small bonus for each move (keeps game active)
  score += 10;

  // Apply difficulty multiplier to final calculation
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[gameState.difficulty];
  score = Math.floor(score * difficultyMultiplier);

  return Math.max(0, score);
};

export const calculateFinalScore = (
  baseScore: number,
  difficulty: Difficulty,
  duration: number,
  result: 'win' | 'loss' | 'draw'
): number => {
  let finalScore = baseScore;

  // Result bonuses
  switch (result) {
    case 'win':
      finalScore += 500;
      break;
    case 'draw':
      finalScore += 250;
      break;
    case 'loss':
      // No bonus for loss
      break;
  }

  // Time bonus (faster games get higher scores)
  const timeBonus = Math.max(0, 1800 - duration) * 2; // 30 minutes max, 2 points per second saved
  finalScore += timeBonus;

  // Apply difficulty multiplier
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  finalScore = Math.floor(finalScore * difficultyMultiplier);

  return Math.max(0, finalScore);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
