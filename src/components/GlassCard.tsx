import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: LucideIcon;
  delay?: number;
}

export function GlassCard({ children, className = '', title, icon: Icon, delay = 0 }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative rounded-2xl border border-cyan-400/20 bg-slate-900/40 backdrop-blur-xl
        shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-shadow hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]
        ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-cyan-400/10">
          {Icon && <Icon className="w-4 h-4 text-cyan-400/70" />}
          <span className="text-xs font-medium uppercase tracking-wider text-cyan-300/60">{title}</span>
        </div>
      )}
      {children}
    </motion.div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-slate-900/40 backdrop-blur-xl ${className}`}>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
    </div>
  );
}

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  if (timer.current) clearTimeout(timer.current);
  timer.current = setTimeout(() => setDebounced(value), delay);

  return debounced;
}
