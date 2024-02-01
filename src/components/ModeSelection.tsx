import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IProps {
  onModeChange: (value: string) => void;
  modes: string[];
}

const ModeSelection = ({ onModeChange, modes }: IProps) => {
  return (
    <div className="z-20">
      <Tabs
        defaultValue="medium"
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
    </div>
  );
};

export default ModeSelection;
