import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// Game difficulty enum
export const difficultySchema = z.enum(["easy", "medium", "hard"]);
export type Difficulty = z.infer<typeof difficultySchema>;

// Game result enum
export const gameResultSchema = z.enum(["win", "loss", "draw"]);
export type GameResult = z.infer<typeof gameResultSchema>;

// Chess piece types
export const pieceTypeSchema = z.enum(["p", "r", "n", "b", "q", "k"]);
export type PieceType = z.infer<typeof pieceTypeSchema>;

// Chess piece color
export const pieceColorSchema = z.enum(["white", "black"]);
export type PieceColor = z.infer<typeof pieceColorSchema>;

// Chess piece schema
export const chessPieceSchema = z.object({
  type: pieceTypeSchema,
  color: pieceColorSchema,
});

export type ChessPiece = z.infer<typeof chessPieceSchema>;

// Game move schema
export const gameMoveSchema = z.object({
  from: z.string(), // e.g., "e2"
  to: z.string(),   // e.g., "e4"
  piece: chessPieceSchema,
  captured: chessPieceSchema.optional(),
  timestamp: z.date(),
});

export type GameMove = z.infer<typeof gameMoveSchema>;

// Game state schema
export const gameStateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  opponentName: z.string(),
  difficulty: difficultySchema,
  result: gameResultSchema.optional(),
  score: z.number().default(0),
  moves: z.array(gameMoveSchema).default([]),
  capturedByUser: z.array(chessPieceSchema).default([]),
  capturedByAI: z.array(chessPieceSchema).default([]),
  currentTurn: pieceColorSchema.default("white"),
  isGameOver: z.boolean().default(false),
  startTime: z.date(),
  endTime: z.date().optional(),
  fen: z.string(), // Chess board position in FEN notation
});

export type GameState = z.infer<typeof gameStateSchema>;

// Game history entry schema
export const gameHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  opponentName: z.string(),
  difficulty: difficultySchema,
  result: gameResultSchema,
  score: z.number(),
  duration: z.number(), // in seconds
  startTime: z.date(),
  endTime: z.date(),
});

export type GameHistory = z.infer<typeof gameHistorySchema>;

// User statistics schema
export const userStatsSchema = z.object({
  userId: z.string(),
  totalGames: z.number().default(0),
  wins: z.number().default(0),
  losses: z.number().default(0),
  draws: z.number().default(0),
  bestScore: z.number().default(0),
  avgScore: z.number().default(0),
  currentStreak: z.number().default(0),
  bestStreak: z.number().default(0),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Insert schemas
export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });
export const insertGameStateSchema = gameStateSchema.omit({ id: true });
export const insertGameHistorySchema = gameHistorySchema.omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type InsertGameHistory = z.infer<typeof insertGameHistorySchema>;
