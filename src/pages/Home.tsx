import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DifficultyModal } from '../components/DifficultyModal';
import { NameInputModal } from '../components/NameInputModal';
import { useTheme } from '../components/ThemeProvider';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { Dices, Play, Trophy, Moon, Sun } from 'lucide-react';
import { Difficulty } from '@/lib/schema';

export const Home: React.FC = () => {
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, stats, needsNameInput, createNewUser } = useUserStore();
  const { startNewGame } = useGameStore();

  const handleStartGame = () => {
    setIsDifficultyModalOpen(true);
  };

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    if (user) {
      startNewGame(difficulty, user.id);
      setLocation('/game');
    }
  };

  const handleNameSubmit = (name: string) => {
    createNewUser(name);
  };

  // Show name input modal if user needs to enter name
  if (needsNameInput) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <NameInputModal
          isOpen={true}
          defaultName=""
          onSubmit={handleNameSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              MonoChess
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Single Player Chess Experience
            </p>
          </motion.div>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dices className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.name || 'Player'}</span>!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Ready for your next chess challenge?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  onClick={handleStartGame}
                >
                  <Play className="w-4 h-4 mr-3" />
                  Start New Game
                </Button>
                
                <Link href="/scores">
                  <Button
                    variant="secondary"
                    className="w-full font-semibold py-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Trophy className="w-4 h-4 mr-3" />
                    My Scores
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.wins || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Wins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500 dark:text-red-400">
                {stats?.losses || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Losses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.bestScore || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Best Score</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <DifficultyModal
        isOpen={isDifficultyModalOpen}
        onClose={() => setIsDifficultyModalOpen(false)}
        onSelectDifficulty={handleSelectDifficulty}
      />
    </div>
  );
};
