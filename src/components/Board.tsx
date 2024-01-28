import IMode from '@/models/IMode';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Timer from './Timer';

interface IProps {
  mode: IMode;
}

const initializeBoard = ({ width, height }: IMode): number[][] => {
  const board: number[][] = [];
  for (let j = 0; j < width; j++) {
    const row: number[] = [];
    for (let i = 0; i < height; i++) {
      row.push(0);
    }
    board.push(row);
  }
  return board;
};

const calculateStartingFields = (
  x: number,
  y: number,
  height: number
): number[] => {
  const fields: number[] = [];
  const neighbourOffsets = [-1, 0, 1];

  for (const xOffset of neighbourOffsets) {
    for (const yOffset of neighbourOffsets) {
      fields.push(height * (x + xOffset) + y + yOffset);
    }
  }
  return fields;
};

const startGame = (x: number, y: number, mode: IMode): number[][] => {
  const startingFields: number[] = calculateStartingFields(x, y, mode.height);

  const board: number[][] = [];
  const mines: number[] = Array(mode.mines);
  const max = mode.height * mode.width;
  let random;
  mines.map(() => {
    do {
      random = Math.floor(Math.random() * max - 1);
    } while (!mines.includes(random) && !startingFields.includes(random));
    mines.push(random);
  });
  let counter: number = 0;
  for (let j = 0; j < mode.width; j++) {
    const row: number[] = [];
    for (let i = 0; i < mode.height; i++) {
      if (mines.includes(counter)) {
        row.push(-1);
      } else {
        row.push(0);
      }
      counter++;
    }
    board.push(row);
  }
  return board;
};

const onTileClick = (x: number, y: number) => {
  console.log(x, y);
};

const Board = ({ mode }: IProps) => {
  // -1 -> mine
  // 0 -> empty
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [board, setBoard] = useState<number[][]>([]);
  console.log(isStarted);
  useEffect(() => {
    setBoard(initializeBoard(mode));
    setIsStarted(false);
  }, [mode]);
  const rows: string = `grid-rows-[${Array(mode.height)
    .fill('1fr')
    .join('_')}]`;
  return (
    <>
      <div className="flex flex-row gap-1">
        <div>Mines left</div>
        <div>|</div>
        {isStarted && <Timer />}
      </div>
      <div className={cn(`grid grid-flow-col m-4`, rows)}>
        {board.map((row, rowNumber) =>
          row.map((_, cellNumber) => (
            <div
              key={`${rowNumber} + ${cellNumber}`}
              data-x-y={`${rowNumber}, ${cellNumber}`}
              className="w-8 h-8 border bg-primary cursor-pointer"
              onClick={() =>
                !isStarted
                  ? (() => {setBoard(startGame(rowNumber, cellNumber, mode));}) : onTileClick(rowNumber, cellNumber)
              }></div>
          ))
        )}
      </div>
    </>
  );
};

export default Board;
