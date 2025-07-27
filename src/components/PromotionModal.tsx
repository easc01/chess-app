
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PIECE_IMAGES } from "@/assets/pieces";

interface PromotionModalProps {
  isOpen: boolean;
  onPromotion: (piece: 'q' | 'r' | 'b' | 'n') => void;
  playerColor: 'white' | 'black';
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onPromotion,
  playerColor,
}) => {
  const promotionPieces = [
    { type: 'q', name: 'Queen' },
    { type: 'r', name: 'Rook' },
    { type: 'b', name: 'Bishop' },
    { type: 'n', name: 'Knight' },
  ] as const;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Promotion Piece</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {promotionPieces.map((piece) => {
            const pieceImg = PIECE_IMAGES[playerColor]?.[piece.type];
            return (
              <Button
                key={piece.type}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => onPromotion(piece.type)}
              >
                {pieceImg && (
                  <img
                    src={pieceImg}
                    alt={piece.name}
                    className="w-8 h-8"
                    draggable={false}
                  />
                )}
                <span className="text-sm">{piece.name}</span>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
