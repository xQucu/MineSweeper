import IMode from '@/models/IMode';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import GameInfo from './GameInfo';

interface IProps {
  mode: IMode;
}

type TBoard = {
  value: number;
  isRevealed: boolean;
  isFlagged: boolean;
}[][];

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
  const [board, setBoard] = useState<TBoard>([]);
  const [flags, setFlags] = useState<number>(0);
  useEffect(() => {
    setBoard(createBoard(mode));
    setGameState(0);
    setFlags(mode.mines);
  }, [mode]);
  console.log(board);

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
      console.log('game over');
      // restartGame();
      return;
    }
    // game still in progress
    if (newBoard[x][y].value == 0) {
      // cells reveal sequence
      revealSequence(x, y, newBoard);
    } else {
      setGameState((g) => {
        console.log(mode.width * mode.height - mode.mines);
        console.log(g - 1);
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

  const rows: string = `grid-rows-[${Array(mode.height)
    .fill('1fr')
    .join('_')}]`;
  //* this comment is for tailwindcss to generate grid properly
  // grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
  // grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
  // grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]

  return (
    <>
      <GameInfo
        gameState={gameState}
        flags={flags}
        onGameRestart={restartGame}
      />
      <div className={cn(`grid grid-flow-col m-4 z-20`, rows)}>
        {board.map((row, x) =>
          row.map((box, y) => (
            <div
              key={`${x} + ${y}`}
              data-x-y={`${x}, ${y}`}
              className={cn(
                'w-8 h-8 border bg-primary  text-primary-foreground',
                box.value === -1 && gameState == -1 && 'bg-secondary',
                !box.isRevealed && 'cursor-pointer',
                box.isRevealed && 'bg-red-500',
                box.isFlagged && 'bg-blue-500'
              )}
              onContextMenu={(e) => {
                e.preventDefault();
                if (gameState != -1 && !box.isRevealed) {
                  setFlags((f) => (box.isFlagged ? f + 1 : f - 1));
                  const newBoard: TBoard = JSON.parse(JSON.stringify(board));
                  newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
                  setBoard(newBoard);
                }
              }}
              onClick={() => {
                gameState == 0
                  ? startGame(x, y)
                  : !box.isRevealed &&
                    gameState != -1 &&
                    !box.isFlagged &&
                    onTileClick(x, y);
              }}>
              {box.isRevealed && box.value > 0 && box.value}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Board;
