import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-5 left-1/2 z-[100] flex items-center gap-3 glass-strong rounded-2xl px-4 py-3 max-w-[90vw]"
          style={{ borderColor: 'rgba(248, 113, 113, 0.3)' }}
        >
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-white/90">{message}</p>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition text-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
