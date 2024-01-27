import IMode from '@/models/IMode';

interface IProps {
  mode: IMode;
}

const generateMines = (mode: IMode): number[] => {
  const mines: number[] = [];
  const max = mode.height * mode.width;
  for (let i = 0; i < mode.mines; i++) {
    mines.push(Math.floor(Math.random() * max));
  }
  return mines;
};

const Board = ({ mode }: IProps) => {
  const board: number[][] | boolean[][] = [];
  console.log(mode);
  const mines: number[] = generateMines(mode);
  let counter: number = 0;
  for (let w = 0; w < mode.width; w++) {
    board.push([]);
    for (let h = 0; h < mode.height; h++) {
      board[w][h] = mines.includes(counter) ? true : false;
      counter++;
    }
  }
  console.log(board);
  return <div>123</div>;
};

export default Board;
