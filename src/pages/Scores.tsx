import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserStore } from '../store/userStore';
import { loadGameHistory } from '../utils/storage';
import { formatDuration } from '../utils/scoring';
import { ArrowLeft, Trophy, X, Handshake } from 'lucide-react';
import { GameHistory } from '@/lib/schema';

export const Scores: React.FC = () => {
  const { user, stats } = useUserStore();
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        const history = await loadGameHistory(user.id);
        setGameHistory(history);
      }
      setIsLoading(false);
    };

    loadHistory();
  }, [user]);

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'win':
        return <Trophy className="text-green-600 dark:text-green-400" />;
      case 'loss':
        return <X className="text-red-600 dark:text-red-400" />;
      case 'draw':
        return <Handshake className="text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  const getResultBadge = (result: string) => {
    const baseClasses = "ml-2 px-2 py-1 text-xs rounded-full";
    switch (result) {
      case 'win':
        return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400`;
      case 'loss':
        return `${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400`;
      case 'draw':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400`;
      default:
        return baseClasses;
    }
  };

  const getResultIconBg = (result: string) => {
    switch (result) {
      case 'win':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'loss':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'draw':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const winRate = stats?.totalGames ? Math.round((stats.wins / stats.totalGames) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Scores</h1>
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Score Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.totalGames || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Games</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {winRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.avgScore || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.bestStreak || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Game History</h2>
              </div>
              
              {gameHistory.length === 0 ? (
                <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                  No games played yet. Start your first game to see your history here!
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {gameHistory.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getResultIconBg(game.result)}`}>
                            {getResultIcon(game.result)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              vs {game.opponentName}
                              <span className={getResultBadge(game.result)}>
                                {game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)} • 
                              {' '}{game.startTime.toLocaleDateString()} • 
                              {' '}{formatDuration(game.duration)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {game.score.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
