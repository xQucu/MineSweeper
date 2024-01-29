import { useState } from 'react';
import ModeSelection from './components/ModeSelection';
import Board from './components/Board';
import IModes from './models/IModes';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';

function App() {
  const modes: IModes = {
    easy: { width: 10, height: 8, mines: 10 },
    medium: { width: 18, height: 14, mines: 40 },
    hard: { width: 24, height: 20, mines: 99 },
  };

  const [mode, setMode] = useState<string>('medium');
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <div className="flex flex-col justify-center items-center h-screen">
        <ModeSelection
          onModeChange={(value) => setMode(value)}
          modes={Object.keys(modes)}
        />
        {!!mode && <Board mode={modes[mode]} />}
      </div>
    </ThemeProvider>
  );
}

export default App;