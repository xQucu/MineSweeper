import { useState } from 'react';
import ModeSelection from './components/ModeSelection';
import Board from './components/Board';
import IModes from './models/IModes';
import { Boxes } from './components/ui/background-boxes';
import { ThemeProvider } from './components/theme-provider';

function App() {
  const modes: IModes = {
    easy: { width: 10, height: 8, mines: 10 },
    medium: { width: 18, height: 14, mines: 40 },
    hard: { width: 24, height: 20, mines: 99 },
  };

  const [mode, setMode] = useState<string>('medium');
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-full relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <div className="z-20">
          <Boxes />
          <div className="flex flex-col justify-center items-center h-screen">
            <ModeSelection
              onModeChange={(value) => setMode(value)}
              modes={Object.keys(modes)}
            />
            {!!mode && <Board mode={modes[mode]} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
