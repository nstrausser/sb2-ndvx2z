import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isSameDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Vercel-inspired status colors
export const STATUS_COLORS = {
  passed: {
    bg: 'bg-[#0070F3]/10',
    text: 'text-[#0070F3]',
    border: 'border-[#0070F3]/20',
  },
  failed: {
    bg: 'bg-[#E00]/10',
    text: 'text-[#E00]',
    border: 'border-[#E00]/20',
  },
  'in-progress': {
    bg: 'bg-[#F5A623]/10',
    text: 'text-[#F5A623]',
    border: 'border-[#F5A623]/20',
  },
  'needs-review': {
    bg: 'bg-[#7928CA]/10',
    text: 'text-[#7928CA]',
    border: 'border-[#7928CA]/20',
  },
  pending: {
    bg: 'bg-[#F5A623]/10',
    text: 'text-[#F5A623]',
    border: 'border-[#F5A623]/20',
  },
  completed: {
    bg: 'bg-[#0070F3]/10',
    text: 'text-[#0070F3]',
    border: 'border-[#0070F3]/20',
  },
  'needs-recut': {
    bg: 'bg-[#E00]/10',
    text: 'text-[#E00]',
    border: 'border-[#E00]/20',
  },
  investigating: {
    bg: 'bg-[#7928CA]/10',
    text: 'text-[#7928CA]',
    border: 'border-[#7928CA]/20',
  },
  resolved: {
    bg: 'bg-[#0070F3]/10',
    text: 'text-[#0070F3]',
    border: 'border-[#0070F3]/20',
  },
  na: {
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    border: 'border-secondary',
  },
};

export function getStatusColor(status: string) {
  const colors = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.na;
  return cn(
    colors.bg,
    colors.text,
    colors.border,
    'border',
    'transition-colors duration-200'
  );
}

export function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
    case 'passed':
    case 'resolved':
      return '●';
    case 'in-progress':
    case 'investigating':
    case 'pending':
      return '○';
    case 'needs-recut':
    case 'failed':
      return '■';
    case 'needs-review':
      return '▲';
    case 'na':
      return '–';
    default:
      return '○';
  }
}

export const formatDate = format;
export const parseISODate = parseISO;
export const isSameDayDate = isSameDay;