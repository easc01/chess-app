import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from 'lucide-react';

interface NameInputModalProps {
  isOpen: boolean;
  defaultName: string;
  onSubmit: (name: string) => void;
}

export const NameInputModal: React.FC<NameInputModalProps> = ({
  isOpen,
  defaultName,
  onSubmit,
}) => {
  const [name, setName] = useState(defaultName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <DialogHeader className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to MonoChess!
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Please enter your name to get started with your chess journey.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
                maxLength={50}
                autoFocus
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              disabled={!name.trim()}
            >
              Start Playing
            </Button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};