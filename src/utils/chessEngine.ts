import { Chess, Move, Square } from 'chess.js';
import { Difficulty } from '@/lib/schema';

export class ChessEngine {
  private chess: Chess;
  private difficulty: Difficulty;

  constructor(chess: Chess, difficulty: Difficulty) {
    this.chess = chess;
    this.difficulty = difficulty;
  }

  // Simple AI that makes moves based on difficulty
  getBestMove(): Move | null {
    const moves = this.chess.moves({ verbose: true });
    if (moves.length === 0) return null;

    // For AI, always promote to queen (strongest piece)
    const processedMoves = moves.map(move => {
      if (move.flags && move.flags.includes('p')) {
        return { ...move, promotion: 'q' };
      }
      return move;
    });

    switch (this.difficulty) {
      case 'easy':
        return this.getRandomMove(processedMoves);
      case 'medium':
        return this.getMediumMove(processedMoves);
      case 'hard':
        return this.getHardMove(processedMoves);
      default:
        return this.getRandomMove(processedMoves);
    }
  }

  private getRandomMove(moves: Move[]): Move {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  private getMediumMove(moves: Move[]): Move {
    // Prioritize captures, then random
    const captures = moves.filter(move => move.captured);
    if (captures.length > 0 && Math.random() > 0.3) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return this.getRandomMove(moves);
  }

  private getHardMove(moves: Move[]): Move {
    // Simple evaluation: prioritize captures and checks
    const captures = moves.filter(move => move.captured);
    const checks = moves.filter(move => {
      this.chess.move(move);
      const inCheck = this.chess.inCheck();
      this.chess.undo();
      return inCheck;
    });

    // Prioritize checkmate
    const checkmates = moves.filter(move => {
      this.chess.move(move);
      const isCheckmate = this.chess.isCheckmate();
      this.chess.undo();
      return isCheckmate;
    });

    if (checkmates.length > 0) {
      return checkmates[0];
    }

    // Prioritize checks (70% chance)
    if (checks.length > 0 && Math.random() > 0.3) {
      return checks[Math.floor(Math.random() * checks.length)];
    }

    // Prioritize captures (80% chance)
    if (captures.length > 0 && Math.random() > 0.2) {
      // Prefer higher value captures
      captures.sort((a, b) => this.getPieceValue(b.captured!) - this.getPieceValue(a.captured!));
      return captures[0];
    }

    // Otherwise random move
    return this.getRandomMove(moves);
  }

  private getPieceValue(piece: string): number {
    const values: { [key: string]: number } = {
      'p': 1,
      'n': 3,
      'b': 3,
      'r': 5,
      'q': 9,
      'k': 100
    };
    return values[piece?.toLowerCase()] || 0;
  }
}
