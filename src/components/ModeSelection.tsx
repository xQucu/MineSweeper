import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IProps {
  onModeChange: (value: string) => void;
  modes: string[];
}

const ModeSelection = ({ onModeChange, modes }: IProps) => {
  return (
    <>
      <h1 className="m-1 text-xl text-center">Select difficulty:</h1>
      <Tabs
        defaultValue="account"
        onValueChange={onModeChange}
        className="w-[400px] text-center">
        <TabsList>
          {modes.map((mode) => (
            <div key={mode} className="m-1">
              <TabsTrigger value={mode}>{mode}</TabsTrigger>
            </div>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
};

export default ModeSelection;
