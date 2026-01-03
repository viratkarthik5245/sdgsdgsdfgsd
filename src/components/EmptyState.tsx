import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-2xl p-16 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d9b8]/20 to-[#1affce]/10 flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-[#00d9b8]" />
      </div>
      <h3 className="text-2xl font-heading font-semibold text-white mb-3">{title}</h3>
      <p className="text-[#b8c5d6] mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
