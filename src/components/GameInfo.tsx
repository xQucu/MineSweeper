import { motion } from 'framer-motion';
import Timer from './Timer';
import { Meteors } from './ui/meteors';
import { FlagTriangleRight, Trophy } from 'lucide-react';

interface IProps {
  gameState: number;
  flags: number;
  onGameRestart: () => void;
}

const GameInfo = ({ gameState, flags, onGameRestart }: IProps) => {
  return (
    <>
      <div className="my-4">
        <div className="relative">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
          <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-3 h-full overflow-hidden rounded-2xl flex flex-col justify-center items-center gap-3">
            <div className="flex flex-row gap-3">
              <FlagTriangleRight /> {flags}
              <Timer gameState={gameState} />
              <Trophy /> Top score here: 000
            </div>
            {gameState == -1 && (
              <motion.button
                className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300"
                onClick={onGameRestart}>
                Play again
              </motion.button>
            )}

            {/* Meaty part - Meteor effect */}
            <Meteors number={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameInfo;
