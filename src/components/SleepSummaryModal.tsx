import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

const SleepSummaryModal = () => {
  const { sleepSummary, clearSleepSummary } = useGameStore();

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)} seconds`;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <AnimatePresence>
      {sleepSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6 shadow-xl text-center w-full max-w-sm border border-slate-600"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Good Morning!</h2>
            <p className="mb-2">
              You slept for <span className="font-semibold text-green-400">{formatDuration(sleepSummary.duration)}</span>.
            </p>
            <div className="space-y-2 my-4">
              <p className="text-lg">
                🩸 HP Recovered: <span className="font-bold text-green-500">+{sleepSummary.hpGained}</span>
              </p>
              <p className="text-lg">
                ⚡ Energy Restored: <span className="font-bold text-blue-500">+{sleepSummary.energyGained}</span>
              </p>
            </div>
            <button
              onClick={clearSleepSummary}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md font-semibold transition-colors w-full"
            >
              Rise and Shine!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SleepSummaryModal;
