import IMode from '@/models/IMode';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import GameInfo from './GameInfo';
import { AnimatePresence, motion } from 'framer-motion';
import Tile from './Tile';
import TBoard from '@/models/TBoard';
interface IProps {
  mode: IMode;
}

const createBoard = ({ width, height }: IMode): TBoard => {
  return Array.from(Array(width), () =>
    Array(height).fill({ value: null, isRevealed: false, isFlagged: false })
  );
};

const Board = ({ mode }: IProps) => {
  /**
   * Represents the status of the game.
   * - 0: Game not started.
   * - >0: Game in progress.
   * - -1: Game finished.
   */
  const [gameState, setGameState] = useState<number>(0);
  const [board, setBoard] = useState<TBoard>(createBoard(mode));
  const [flags, setFlags] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  useEffect(() => {
    setBoard(createBoard(mode));
    setGameState(0);
    setFlags(mode.mines);
  }, [mode]);

  const restartGame = () => {
    setBoard(createBoard(mode));
    setGameState(0);
    setFlags(mode.mines);
  };
  const revealSequence = (x: number, y: number, newBoard: TBoard) => {
    const offsets = [-1, 0, 1];
    const revealCell = (x: number, y: number) => {
      if (newBoard[x][y].isRevealed) return;
      setGameState((g) =>
        mode.width * mode.height - mode.mines === gameState - 1 ? -1 : g + 1
      );
      if (newBoard[x][y].isFlagged) {
        setFlags((f) => f + 1);
        newBoard[x][y].isFlagged = false;
      }
      newBoard[x][y].isRevealed = true;
      if (newBoard[x][y].value === 0) {
        offsets.forEach((xOffset) => {
          offsets.forEach((yOffset) => {
            const newX = x + xOffset;
            const newY = y + yOffset;
            if (
              newX >= 0 &&
              newY >= 0 &&
              newX < newBoard.length &&
              newY < newBoard[0].length
            ) {
              revealCell(newX, newY);
            }
          });
        });
      }
    };

    revealCell(x, y);
  };

  const onTileClick = (x: number, y: number, startingBoard?: TBoard) => {
    const newBoard: TBoard = startingBoard ?? JSON.parse(JSON.stringify(board));
    if (newBoard[x][y].value == -1) {
      // game over, player failed
      setGameState(-1);
      ('game over');
      // restartGame();
      return;
    }
    // game still in progress
    if (newBoard[x][y].value == 0) {
      // cells reveal sequence
      revealSequence(x, y, newBoard);
    } else {
      setGameState((g) => {
        mode.width * mode.height - mode.mines;
        g - 1;
        return mode.width * mode.height - mode.mines - 1 == g ? -1 : g + 1;
      });
    }
    newBoard[x][y].isRevealed = true;

    setBoard(newBoard);
  };

  const startGame = (x: number, y: number) => {
    // deep copy of board table
    const newBoard = JSON.parse(JSON.stringify(board));
    const neighbourOffsets = [-1, 0, 1];

    // marking starting fields
    for (const xOffset of neighbourOffsets) {
      for (const yOffset of neighbourOffsets) {
        if (
          x - xOffset >= 0 &&
          y - yOffset >= 0 &&
          x - xOffset < mode.width &&
          y - yOffset < mode.height
        ) {
          newBoard[x - xOffset][y - yOffset].value = 0;
        }
      }
    }

    // placing mines
    for (let i = 0; i < mode.mines; i++) {
      const a = Math.floor(Math.random() * (mode.width - 1));
      const b = Math.floor(Math.random() * (mode.height - 1));
      if (newBoard[a][b].value != 0 && newBoard[a][b].value != -1) {
        newBoard[a][b].value = -1;
      } else {
        i--;
      }
    }
    // generating numbers
    newBoard.map((row: { value: number; isRevealed: boolean }[], x: number) =>
      row.map((state, y) => {
        const value = state.value;
        if (value !== -1) {
          let sum = 0;
          const offsets = [-1, 0, 1];

          offsets.forEach((xOffset) => {
            offsets.forEach((yOffset) => {
              const newX = x + xOffset;
              const newY = y + yOffset;

              if (
                newX >= 0 &&
                newX < newBoard.length &&
                newY >= 0 &&
                newY < newBoard[0].length &&
                newBoard[newX][newY].value === -1
              ) {
                sum++;
              }
            });
          });

          newBoard[x][y].value = sum;
        }
      })
    );
    onTileClick(x, y, newBoard);
  };

  return (
    <>
      <GameInfo
        gameState={gameState}
        flags={flags}
        onGameRestart={restartGame}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
      <motion.div
        className={cn(
          'z-20',
          gameState === -1 ? 'bg-black opacity-70 bg-opacity-0' : 'opacity-100 '
        )}>
        <AnimatePresence mode="wait">
          <motion.div
            layout
            variants={{ visible: { transition: { staggerChildren: 0.002 } } }}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              gridTemplateRows: `repeat(${mode.height}, minmax(0,1fr))`,
            }}
            className="grid grid-flow-col m-4 z-20">
            {board.map((row, x) =>
              row.map((box, y) => (
                <Tile
                  soundEnabled={soundEnabled}
                  key={`${x}${y}`}
                  gameState={gameState}
                  box={box}
                  setFlags={setFlags}
                  x={x}
                  y={y}
                  setBoard={setBoard}
                  board={board}
                  startGame={startGame}
                  onTileClick={onTileClick}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
};
export default Board;
