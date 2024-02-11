import { Bomb, FlagTriangleRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TBoard from '@/models/TBoard';
import reveal from '@/assets/sounds/reveal.mp3';
import flagOn from '@/assets/sounds/flagOn.mp3';
import flagOff from '@/assets/sounds/flagOff.mp3';
import mine from '@/assets/sounds/mine.mp3';
interface IProps {
  soundEnabled: boolean;
  gameState: number;
  box: { value: number; isRevealed: boolean; isFlagged: boolean };
  setFlags: React.Dispatch<React.SetStateAction<number>>;
  x: number;
  y: number;
  setBoard: React.Dispatch<
    React.SetStateAction<
      { value: number; isRevealed: boolean; isFlagged: boolean }[][]
    >
  >;
  board: TBoard;
  startGame: (x: number, y: number) => void;
  onTileClick: (x: number, y: number, startingBoard?: TBoard) => void;
}

const revealSound = new Audio(reveal);
const flagOnSound = new Audio(flagOn);
const flagOffSound = new Audio(flagOff);
const mineSound = new Audio(mine);

const getNumberColor = (number: number): string => {
  switch (number) {
    case 1:
      return 'text-blue-900';
    case 2:
      return 'text-green-900';
    case 3:
      return 'text-red-900';
    case 4:
      return 'text-purple-900';
    case 5:
      return 'text-maroon-900';
    case 6:
      return 'text-turquoise-900';
    case 7:
      return 'text-black-900';
    case 8:
      return 'text-gray-900';
    default:
      return 'text-black-900';
  }
};

const Tile = ({
  soundEnabled,
  gameState,
  box,
  setFlags,
  x,
  y,
  setBoard,
  board,
  startGame,
  onTileClick,
}: IProps) => {
  return (
    <motion.div
      whileHover={
        !box.isRevealed && !box.isFlagged && gameState !== -1
          ? { scale: 0.9 }
          : {}
      }
      whileTap={gameState !== -1 && !box.isRevealed ? { scale: 1.1 } : {}}
      variants={{
        hidden: { y: 10, opacity: 0, scale: 0 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 1000,
          },
        },
        exit: { y: -10, opacity: 0 },
      }}
      transition={{ stiffness: 0 }}
      className={cn(
        'w-8 h-8 border bg-primary font-semibold text-xl text-primary-foreground flex items-center justify-center',
        !box.isRevealed &&
          gameState !== -1 &&
          !box.isFlagged &&
          'shadow-[inset_#e4e4e7_1px_1px_1px_2px]',
        !box.isRevealed && 'cursor-pointer',

        box.isRevealed && box.value !== -1 && 'bg-ring',
        box.isRevealed && getNumberColor(box.value)
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        if (box.isFlagged) {
          soundEnabled && flagOffSound.play();
        } else {
          soundEnabled && !box.isRevealed && flagOnSound.play();
        }
        if (gameState != -1 && !box.isRevealed) {
          setFlags((f) => (box.isFlagged ? f + 1 : f - 1));
          const newBoard: TBoard = JSON.parse(JSON.stringify(board));
          newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
          setBoard(newBoard);
        }
      }}
      onClick={() => {
        if (gameState == 0) {
          startGame(x, y);
          soundEnabled && revealSound.play();
        } else if (!box.isRevealed && gameState !== -1 && !box.isFlagged) {
          if (box.value === -1) {
            soundEnabled && mineSound.play();
          } else {
            soundEnabled && revealSound.play();
          }
          onTileClick(x, y);
        }
      }}>
      {box.isFlagged && (gameState !== -1 || box.value === -1) && (
        <FlagTriangleRight color="blue" />
      )}
      {box.value === -1 && gameState == -1 && !box.isFlagged && (
        <Bomb color="red" />
      )}
      {gameState == -1 && box.isFlagged && box.value !== -1 && <X />}
      {box.isRevealed && box.value > 0 && box.value}
    </motion.div>
  );
};

export default Tile;
