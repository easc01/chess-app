import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { Difficulty } from '@/lib/schema';

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DIFFICULTIES = [
  {
    level: 'easy' as Difficulty,
    title: 'Easy',
    description: 'Perfect for beginners',
    stars: 1,
    color: 'green',
  },
  {
    level: 'medium' as Difficulty,
    title: 'Medium',
    description: 'Good challenge for most players',
    stars: 2,
    color: 'orange',
  },
  {
    level: 'hard' as Difficulty,
    title: 'Hard',
    description: 'For experienced players',
    stars: 3,
    color: 'red',
  },
];

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  isOpen,
  onClose,
  onSelectDifficulty,
}) => {
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    onSelectDifficulty(difficulty);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Choose Difficulty
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Select your opponent's skill level
          </p>
        </DialogHeader>

        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {DIFFICULTIES.map((diff, index) => (
              <motion.div
                key={diff.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className={`w-full p-4 h-auto border-2 hover:border-${diff.color}-500 hover:bg-${diff.color}-50 dark:hover:bg-${diff.color}-900/20 transition-all duration-200`}
                  onClick={() => handleSelectDifficulty(diff.level)}
                >
                  <div className="flex items-center justify-between w-full text-left">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {diff.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {diff.description}
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: diff.stars }, (_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
