import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Home, RotateCcw, X, Handshake } from 'lucide-react';
import { GameResult } from '@/lib/schema';

interface GameEndModalProps {
  isOpen: boolean;
  result: GameResult;
  opponentName: string;
  finalScore: number;
  duration: string;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen,
  result,
  opponentName,
  finalScore,
  duration,
  onPlayAgain,
  onBackToHome,
}) => {
  const getResultIcon = () => {
    switch (result) {
      case 'win':
        return <Trophy className="text-3xl text-green-600 dark:text-green-400" />;
      case 'loss':
        return <X className="text-3xl text-red-600 dark:text-red-400" />;
      case 'draw':
        return <Handshake className="text-3xl text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getResultTitle = () => {
    switch (result) {
      case 'win':
        return 'Congratulations!';
      case 'loss':
        return 'Game Over';
      case 'draw':
        return 'Draw!';
    }
  };

  const getResultMessage = () => {
    switch (result) {
      case 'win':
        return `You won against ${opponentName}`;
      case 'loss':
        return `${opponentName} won this time`;
      case 'draw':
        return `You drew with ${opponentName}`;
    }
  };

  const getResultColor = () => {
    switch (result) {
      case 'win':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'loss':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'draw':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-center mb-6">
            <div className={`w-20 h-20 ${getResultColor()} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {getResultIcon()}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getResultTitle()}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {getResultMessage()}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {finalScore.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Final Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {duration}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={onPlayAgain}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={onBackToHome}
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
