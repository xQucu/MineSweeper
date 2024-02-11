import { TimerIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface IProps {
  gameState: number;
}

const Timer = ({ gameState }: IProps) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameState > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => ++prevTime);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      gameState == -1 && setTime(0);
      gameState === 0 && setTime(0);
    };
  }, [gameState]);

  return (
    <div className="flex flex-row gap-1">
      <TimerIcon /> {time}
    </div>
  );
};

export default Timer;
