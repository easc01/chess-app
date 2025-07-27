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
  pendingPromotion: { from: Square; to: Square } | null;

  // Actions
  startNewGame: (difficulty: Difficulty, userId: string) => void;
  makeMove: (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => Promise<boolean>;
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
  pendingPromotion: null,

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
      pendingPromotion: null,
    });
  },

  makeMove: async (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
    const { game, chess } = get();
    if (!game || !chess || game.isGameOver || !get().isPlayerTurn) return false;

    try {
      // Check if this is a pawn promotion move
      const piece = chess.get(from);
      const isPromotion = piece?.type === 'p' && 
        ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'));

      if (isPromotion && !promotion) {
        // Set pending promotion and return - wait for user selection
        set({ pendingPromotion: { from, to } });
        return false;
      }

      const moveOptions: any = { from, to };
      if (promotion) {
        moveOptions.promotion = promotion;
      }

      const move = chess.move(moveOptions);
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
        pendingPromotion: null,
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
      pendingPromotion: null,
    });
  },

  makeAIMove: async () => {
    const { game, chess } = get();
    if (!game || !chess || game.isGameOver || get().isPlayerTurn) return;

    const engine = new ChessEngine(chess, game.difficulty);
    const bestMove = engine.getBestMove();

    if (!bestMove) return;

    // Handle AI promotion
    const moveOptions: any = {
      from: bestMove.from,
      to: bestMove.to
    };

    if (bestMove.flags && bestMove.flags.includes('p')) {
      moveOptions.promotion = 'q'; // AI always promotes to queen
    }

    const move = chess.move(moveOptions);

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