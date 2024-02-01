import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
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
        <AnimatePresence>
          <TabsList>
            {modes.map((mode) => (
              <motion.div
                key={mode}
                className="m-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <TabsTrigger value={mode}>{mode}</TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default ModeSelection;
