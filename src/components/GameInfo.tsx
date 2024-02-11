import { AnimatePresence, motion } from 'framer-motion';
import Timer from './Timer';
import { Meteors } from './ui/meteors';
import { FlagTriangleRight, Volume2, VolumeX } from 'lucide-react';
import toggleSound from '@/assets/sounds/toggleSound.mp3';

interface IProps {
  gameState: number;
  flags: number;
  onGameRestart: () => void;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const soundToggle = new Audio(toggleSound);

const GameInfo = ({
  gameState,
  flags,
  onGameRestart,
  soundEnabled,
  setSoundEnabled,
}: IProps) => {
  return (
    <>
      <div className="my-4">
        <motion.div
          layout
          className="relative z-30"
          animate={gameState == -1 ? { scale: 1.2, y: 100 } : {}}
          transition={{ duration: 1 }}>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
          <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-3 h-full overflow-hidden rounded-2xl flex flex-col justify-center items-center gap-3 ">
            <div className="flex flex-row gap-3">
              <div
                onClick={() => {
                  soundToggle.play();
                  setSoundEnabled((s) => !s);
                }}>
                {soundEnabled ? <Volume2 /> : <VolumeX />}
              </div>
              <FlagTriangleRight /> {flags}
              <Timer gameState={gameState} />
              {/* <Trophy /> Top score here: 000 */}
            </div>
            <AnimatePresence>
              {gameState == -1 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300"
                  onClick={onGameRestart}>
                  {gameState === -1 && flags === 0
                    ? 'Start Game'
                    : 'Play Again'}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Meaty part - Meteor effect */}
            <Meteors number={20} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default GameInfo;
