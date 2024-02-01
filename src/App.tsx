import { useState } from 'react';
import ModeSelection from './components/ModeSelection';
import Board from './components/Board';
import IModes from './models/IModes';
import { ThemeProvider } from './components/theme-provider';

function App() {
  const modes: IModes = {
    easy: { width: 10, height: 8, mines: 10 },
    medium: { width: 18, height: 14, mines: 40 },
    hard: { width: 24, height: 20, mines: 99 },
  };

  const [mode, setMode] = useState<string>('medium');
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
            Mine Sweeper
          </p>
          <ModeSelection
            onModeChange={(value) => setMode(value)}
            modes={Object.keys(modes)}
          />
          {!!mode && <Board mode={modes[mode]} />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
