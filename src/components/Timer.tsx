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
    if (gameState === -1) {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [gameState]);


  return <div>{time}</div>;
};

export default Timer;
