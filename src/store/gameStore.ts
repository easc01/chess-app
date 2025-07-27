import { create } from 'zustand';
import { Chess, Square } from 'chess.js';
import { GameState, Difficulty, GameResult, ChessPiece, GameMove } from '@/lib/schema';
import { generateRandomName } from '../utils/nameGenerator';
import { calculateScore } from '../utils/scoring';
import { saveGameHistory } from '../utils/storage';
import { ChessEngine } from '../utils/chessEngine';

interface GameStore {
  game: GameState | null;
  chess: Chess | null;
  selectedSquare: Square | null;
  legalMoves: Square[];
  isPlayerTurn: boolean;
  
  // Actions
  startNewGame: (difficulty: Difficulty, userId: string) => void;
  makeMove: (from: Square, to: Square) => Promise<boolean>;
  selectSquare: (square: Square) => void;
  clearSelection: () => void;
  forfeitGame: () => Promise<void>;
  endGame: (result: GameResult) => Promise<void>;
  resetGame: () => void;
  makeAIMove: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  chess: null,
  selectedSquare: null,
  legalMoves: [],
  isPlayerTurn: true,

  startNewGame: (difficulty: Difficulty, userId: string) => {
    const chess = new Chess();
    const opponentName = generateRandomName();
    
    const gameState: GameState = {
      id: crypto.randomUUID(),
      userId,
      opponentName,
      difficulty,
      score: 1000, // Starting score
      moves: [],
      capturedByUser: [],
      capturedByAI: [],
      currentTurn: 'white',
      isGameOver: false,
      startTime: new Date(),
      fen: chess.fen(),
    };

    set({
      game: gameState,
      chess,
      selectedSquare: null,
      legalMoves: [],
      isPlayerTurn: true,
    });
  },

  makeMove: async (from: Square, to: Square) => {
    const { chess, game } = get();
    if (!chess || !game || game.isGameOver) return false;

    try {
      const move = chess.move({ from, to });
      if (!move) return false;

      // Update captured pieces
      const capturedPiece = move.captured ? {
        type: move.captured as any,
        color: move.color === 'w' ? 'black' : 'white'
      } as ChessPiece : undefined;

      const gameMove: GameMove = {
        from,
        to,
        piece: {
          type: move.piece as any,
          color: move.color === 'w' ? 'white' : 'black'
        },
        captured: capturedPiece,
        timestamp: new Date(),
      };

      const updatedGame = {
        ...game,
        moves: [...game.moves, gameMove],
        fen: chess.fen(),
        currentTurn: chess.turn() === 'w' ? 'white' as const : 'black' as const,
        score: calculateScore(game, gameMove) ?? game.score,
        capturedByUser: capturedPiece && capturedPiece.color === 'black' 
          ? [...game.capturedByUser, capturedPiece] 
          : game.capturedByUser,
      };

      set({
        game: updatedGame,
        selectedSquare: null,
        legalMoves: [],
        isPlayerTurn: false,
      });

      // Check for game end
      if (chess.isGameOver()) {
        let result: GameResult;
        if (chess.isCheckmate()) {
          result = chess.turn() === 'b' ? 'win' : 'loss';
        } else {
          result = 'draw';
        }
        await get().endGame(result);
      } else {
        // Make AI move after a short delay
        setTimeout(() => get().makeAIMove(), 500);
      }

      return true;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  },

  selectSquare: (square: Square) => {
    const { chess, selectedSquare } = get();
    if (!chess) return;

    if (selectedSquare === square) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }

    if (selectedSquare) {
      // Attempt to make a move
      get().makeMove(selectedSquare, square);
      return;
    }

    // Select new square and show legal moves
    const piece = chess.get(square);
    if (piece && piece.color === 'w') {
      const moves = chess.moves({ square, verbose: true });
      const legalMoves = moves.map(move => move.to as Square);
      
      set({
        selectedSquare: square,
        legalMoves,
      });
    } else {
      set({ selectedSquare: null, legalMoves: [] });
    }
  },

  clearSelection: () => {
    set({ selectedSquare: null, legalMoves: [] });
  },

  forfeitGame: async () => {
    await get().endGame('loss');
  },

  endGame: async (result: GameResult) => {
    const { game } = get();
    if (!game) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - game.startTime.getTime()) / 1000);
    
    const finalGame = {
      ...game,
      result,
      endTime,
      isGameOver: true,
    };

    set({ game: finalGame });

    // Save to history
    await saveGameHistory({
      userId: game.userId,
      opponentName: game.opponentName,
      difficulty: game.difficulty,
      result,
      score: game.score,
      duration,
      startTime: game.startTime,
      endTime,
    });
  },

  resetGame: () => {
    set({
      game: null,
      chess: null,
      selectedSquare: null,
      legalMoves: [],
      isPlayerTurn: true,
    });
  },

  makeAIMove: async () => {
    const { chess, game } = get();
    if (!chess || !game || game.isGameOver) return;

    // Use AI engine to get best move
    const engine = new ChessEngine(chess, game.difficulty);
    const bestMove = engine.getBestMove();
    if (!bestMove) return;

    const move = chess.move(bestMove);

    if (move) {
      const capturedPiece = move.captured ? {
        type: move.captured as any,
        color: move.color === 'b' ? 'white' : 'black'
      } as ChessPiece : undefined;

      const gameMove: GameMove = {
        from: move.from as Square,
        to: move.to as Square,
        piece: {
          type: move.piece as any,
          color: 'black'
        },
        captured: capturedPiece,
        timestamp: new Date(),
      };

      const updatedGame = {
        ...game,
        moves: [...game.moves, gameMove],
        fen: chess.fen(),
        currentTurn: chess.turn() === 'w' ? 'white' as const : 'black' as const,
        score: calculateScore(game, gameMove) ?? game.score,
        capturedByAI: capturedPiece 
          ? [...game.capturedByAI, capturedPiece] 
          : game.capturedByAI,
      };

      set({
        game: updatedGame,
        isPlayerTurn: true,
      });

      // Check for game end
      if (chess.isGameOver()) {
        let result: GameResult;
        if (chess.isCheckmate()) {
          result = chess.turn() === 'w' ? 'loss' : 'win';
        } else {
          result = 'draw';
        }
        await get().endGame(result);
      }
    }
  },
}));
