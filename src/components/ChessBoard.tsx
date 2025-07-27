import React from "react";
import { Square } from "chess.js";
import { useGameStore } from "../store/gameStore";
import { cn } from "../lib/utils";
import { PIECE_IMAGES } from "@/assets/pieces";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

export const ChessBoard: React.FC = () => {
  const { chess, selectedSquare, legalMoves, selectSquare } = useGameStore();

  if (!chess) return null;

  const board = chess.board();
  const isSquareLight = (file: number, rank: number) => {
    return (file + rank) % 2 === 0;
  };

  const isSquareSelected = (square: Square) => {
    return selectedSquare === square;
  };

  const isLegalMove = (square: Square) => {
    return legalMoves.includes(square);
  };

  const handleSquareClick = (square: Square) => {
    selectSquare(square);
  };

  return (
    <div className="aspect-square max-w-full mx-auto border-2 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 aspect-square">
        {RANKS.map((rank, rankIndex) =>
          FILES.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const piece = board[rankIndex][fileIndex];
            const isLight = isSquareLight(fileIndex, rankIndex);
            const isSelected = isSquareSelected(square);
            const isLegal = isLegalMove(square);

            return (
              <div
                key={square}
                className={cn(
                  "flex items-center justify-center text-3xl cursor-pointer transition-colors duration-200 relative aspect-square",
                  isLight ? "bg-chess-light" : "bg-chess-dark",
                  isSelected && "bg-chess-highlight",
                  isLegal && "bg-chess-move",
                  "hover:brightness-110"
                )}
                data-square={square}
                onClick={() => handleSquareClick(square)}
              >
                {piece && (
                  <div className="select-none z-10 relative">
                    {(() => {
                      const color = piece.color === "w" ? "white" : "black";
                      const pieceImg = PIECE_IMAGES[color]?.[piece.type];
                      return pieceImg ? (
                        <img
                          src={pieceImg}
                          alt=""
                          className="w-8 h-8"
                          draggable={false}
                        />
                      ) : null;
                    })()}
                  </div>
                )}
                {isLegal && !piece && (
                  <div className="w-3 h-3 bg-green-500 rounded-full opacity-60" />
                )}

                {isLegal && piece && (
                  <div className="absolute inset-0 border-4 border-green-500 rounded-lg opacity-60" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
