import IMode from '@/models/IMode';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Timer from './Timer';

interface IProps {
  mode: IMode;
}
const onTileClick = (x: number, y: number) => {
  console.log(x, y);
};

const createBoard = ({ width, height }: IMode): number[][] => {
  return Array.from(Array(width), () => Array(height).fill(null));
};

const Board = ({ mode }: IProps) => {
  // -1 -> mine
  // 0 -> empty
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [board, setBoard] = useState<number[][]>([]);
  useEffect(() => {
    setBoard(createBoard(mode));
    setIsStarted(false);
  }, [mode]);
  console.log(board);

  const startGame = (x: number, y: number) => {
    const newBoard = createBoard(mode);
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
          newBoard[x - xOffset][y - yOffset] = 0;
        }
      }
    }

    // placing mines
    for (let i = 0; i < mode.mines; i++) {
      const a = Math.floor(Math.random() * (mode.width - 1));
      const b = Math.floor(Math.random() * (mode.height - 1));
      if (newBoard[a][b] != 0) {
        newBoard[a][b] = -1;
      } else {
        i--;
      }
    }
    // generating numbers
    newBoard.map((row, x) =>
      row.map((value, y) => {
        if (value != -1) {
          let sum = 0;

          if (y - 1 >= 0 && newBoard[x][y - 1] === -1) {
            sum++;
          }

          if (x - 1 >= 0 && newBoard[x - 1][y] === -1) {
            sum++;
          }

          if (x - 1 >= 0 && y - 1 >= 0 && newBoard[x - 1][y - 1] === -1) {
            sum++;
          }

          if (
            x - 1 >= 0 &&
            y + 1 < newBoard[0].length &&
            newBoard[x - 1][y + 1] === -1
          ) {
            sum++;
          }

          if (y + 1 < newBoard[0].length && newBoard[x][y + 1] === -1) {
            sum++;
          }

          if (x + 1 < newBoard.length && newBoard[x + 1][y] === -1) {
            sum++;
          }

          if (
            x + 1 < newBoard.length &&
            y + 1 < newBoard[0].length &&
            newBoard[x + 1][y + 1] === -1
          ) {
            sum++;
          }

          if (
            x + 1 < newBoard.length &&
            y - 1 >= 0 &&
            newBoard[x + 1][y - 1] === -1
          ) {
            sum++;
          }

          newBoard[x][y] = sum;
        }
      })
    );

    setBoard(newBoard);
    setIsStarted(true);
  };

  const rows: string = `grid-rows-[${Array(mode.height)
    .fill('1fr')
    .join('_')}]`;
  //! this comment is for tailwindcss to generate grid properly
  // grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
  // grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
  // grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]

  return (
    <>
      <div className="flex flex-row gap-1">
        <div>Mines left</div>
        <div>|</div>
        {isStarted && <Timer />}
      </div>
      <div className={cn(`grid grid-flow-col m-4`, rows)}>
        {board.map((row, x) =>
          row.map((value, y) => (
            <div
              key={`${x} + ${y}`}
              data-x-y={`${x}, ${y}`}
              className={cn(
                'w-8 h-8 border bg-primary cursor-pointer text-primary-foreground',
                value === -1 && 'bg-secondary'
              )}
              onClick={() =>
                !isStarted ? startGame(x, y) : onTileClick(x, y)
              }></div>
          ))
        )}
      </div>
    </>
  );
};

export default Board;
