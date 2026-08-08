import React from 'react';
import { TriageLevel } from '../types';
import { AlertOctagon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface TriageBadgeProps {
  level: TriageLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const TriageBadge: React.FC<TriageBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const configs = {
    RED: {
      bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
      icon: AlertOctagon,
      label: 'RED — Emergency',
      pulse: true,
    },
    ORANGE: {
      bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
      icon: AlertTriangle,
      label: 'ORANGE — Urgent',
      pulse: false,
    },
    YELLOW: {
      bg: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/80 dark:text-yellow-200 dark:border-yellow-800',
      icon: Clock,
      label: 'YELLOW — Priority',
      pulse: false,
    },
    GREEN: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
      icon: CheckCircle,
      label: 'GREEN — Routine',
      pulse: false,
    },
  };

  const config = configs[level] || configs.GREEN;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 rounded-xl gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center border font-medium ${config.bg} ${sizeClasses} ${
        config.pulse ? 'animate-pulse' : ''
      }`}
    >
      {showIcon && <IconComponent className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
