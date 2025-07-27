import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChessBoard } from "../components/ChessBoard";
import { GameEndModal } from "../components/GameEndModal";
import { PromotionModal } from "../components/PromotionModal";
import { useGameStore } from "../store/gameStore";
import { useUserStore } from "../store/userStore";
import { Flag, Bot, User } from "lucide-react";
import { formatDuration } from "../utils/scoring";
import { PIECE_IMAGES } from "@/assets/pieces";

export const Game: React.FC = () => {
  const [, setLocation] = useLocation();
  const [gameTimer, setGameTimer] = useState("00:00");
  const [isGameEndModalOpen, setIsGameEndModalOpen] = useState(false);
  const [showFinalBoard, setShowFinalBoard] = useState(false);

  const { game, chess, forfeitGame, resetGame, pendingPromotion, makeMove } = useGameStore();
  const { user, updateStats } = useUserStore();

  // Redirect if no game in progress
  useEffect(() => {
    if (!game || !chess) {
      setLocation("/");
    }
  }, [game, chess, setLocation]);

  // Update timer
  useEffect(() => {
    if (!game?.startTime || game.isGameOver) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - game.startTime.getTime();
      setGameTimer(formatDuration(Math.floor(elapsed / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.startTime, game?.isGameOver]);

  // Handle game end
  useEffect(() => {
    if (game?.isGameOver && game.result) {
      setIsGameEndModalOpen(true);
      setShowFinalBoard(false);
      updateStats(game.result, game.score);
    }
  }, [game?.isGameOver, game?.result, game?.score, updateStats]);

  const handleForfeit = async () => {
    if (game?.isGameOver) {
      // Show game end modal again
      setIsGameEndModalOpen(true);
      setShowFinalBoard(false);
    } else {
      if (window.confirm("Are you sure you want to forfeit this game?")) {
        await forfeitGame();
      }
    }
  };

  const handlePlayAgain = () => {
    setIsGameEndModalOpen(false);
    resetGame();
    setLocation("/");
  };

  const handleBackToHome = () => {
    setIsGameEndModalOpen(false);
    resetGame();
    setLocation("/");
  };

  const handleCloseGameEndModal = () => {
    setIsGameEndModalOpen(false);
    setShowFinalBoard(true);
  };

  const handlePromotion = (piece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      makeMove(pendingPromotion.from, pendingPromotion.to, piece);
    }
  };

  if (!game || !chess) {
    return null;
  }

  const currentPlayerName =
    game.currentTurn === "white" ? user?.name || "You" : game.opponentName;

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Game Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <Card>
          <CardContent className="flex justify-between items-center p-4">
            <Button
              variant="outline"
              onClick={handleForfeit}
              className={`flex items-center px-4 py-2 ${
                game?.isGameOver
                  ? "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  : "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
              }`}
            >
              <Flag className="w-4 h-4 mr-2" />
              {game?.isGameOver ? "Show Results" : "Forfeit"}
            </Button>

            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Turn
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {currentPlayerName}'s Turn
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Score
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {game.score.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Time
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {gameTimer}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Board Container */}
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Opponent Info & Captured Pieces (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="mb-4">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot className="text-white" />
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {game.opponentName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {game.difficulty.charAt(0).toUpperCase() +
                    game.difficulty.slice(1)}{" "}
                  AI
                </div>
              </CardContent>
            </Card>

            {/* Captured Pieces by User */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Captured
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {game.capturedByAI.map((piece, index) => {
                    const Img = PIECE_IMAGES[piece.color][piece.type];
                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center"
                      >
                        {Img && <img src={Img} alt={piece.type} className="w-6 h-6" draggable={false} />}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chess Board - Full width on mobile, centered on desktop */}
          <div className="col-span-12 lg:col-span-6">
            {/* AI Captured Pieces - Above board (Mobile only) */}
            {game.capturedByAI.length > 0 && (
              <Card className="lg:hidden mb-4">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white w-4 h-4" />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {game.opponentName}
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                        {game.capturedByAI.map((piece, index) => {
                          const pieceImg = PIECE_IMAGES[piece.color][piece.type];
                          return (
                            <motion.div
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0"
                            >
                              {pieceImg && (
                                <img
                                  src={pieceImg}
                                  alt={piece.type}
                                  className="w-4 h-4"
                                  draggable={false}
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <div className={game?.isGameOver ? "pointer-events-none opacity-75" : ""}>
                  <ChessBoard />
                </div>
                {game?.isGameOver && showFinalBoard && (
                  <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Final Position - Game Over
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Player Info - User info only */}
            <div className="lg:hidden mt-4">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="text-white w-4 h-4" />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {user?.name || "You"}
                      </div>
                    </div>
                    {game.capturedByUser.length > 0 && (
                      <div className="flex-1 overflow-hidden">
                        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                          {game.capturedByUser.map((piece, index) => {
                            const pieceImg = PIECE_IMAGES[piece.color][piece.type];
                            return (
                              <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0"
                              >
                                {pieceImg && (
                                  <img
                                    src={pieceImg}
                                    alt={piece.type}
                                    className="w-4 h-4"
                                    draggable={false}
                                  />
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - User Info & Captured Pieces (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="mb-4">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="text-white" />
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {user?.name || "You"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  You
                </div>
              </CardContent>
            </Card>

            {/* Captured Pieces by AI */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Captured
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {game.capturedByUser.map((piece, index) => {
                    const Img = PIECE_IMAGES[piece.color][piece.type];
                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center"
                      >
                        {Img && <img src={Img} alt={piece.type} className="w-6 h-6" draggable={false} />}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Promotion Modal */}
      <PromotionModal
        isOpen={!!pendingPromotion}
        onPromotion={handlePromotion}
        playerColor="white"
      />

      {/* Game End Modal */}
      {game.result && (
        <GameEndModal
          isOpen={isGameEndModalOpen}
          result={game.result}
          opponentName={game.opponentName}
          finalScore={game.score}
          duration={formatDuration(
            game.endTime
              ? Math.floor(
                  (game.endTime.getTime() - game.startTime.getTime()) / 1000
                )
              : 0
          )}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
          onClose={handleCloseGameEndModal}
        />
      )}
    </div>
  );
};
