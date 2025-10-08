
import { LucideIcon, HelpCircle, CheckCircle, XCircle, Clock, Hourglass, Car, CircleDotDashed } from 'lucide-react';
import { BadgeProps } from '@/components/ui/badge';

type StatusInfo = {
    label: string;
    icon: LucideIcon;
    color: string;
    variant: BadgeProps['variant'];
    className?: string;
};

const statusMap: Record<string, StatusInfo> = {
    requested: {
        label: 'Requested',
        icon: Hourglass,
        color: '#f59e0b', // amber-500
        variant: 'outline',
        className: 'border-amber-500/50 text-amber-600'
    },
    accepted: {
        label: 'Accepted',
        icon: CircleDotDashed,
        color: '#3b82f6', // blue-500
        variant: 'secondary',
        className: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    in_progress: {
        label: 'In Progress',
        icon: Car,
        color: '#22c55e', // green-500
        variant: 'secondary',
        className: 'bg-green-100 text-green-700 border-green-200'
    },
    completed: {
        label: 'Completed',
        icon: CheckCircle,
        color: '#16a34a', // green-600
        variant: 'default',
        className: 'bg-green-600 text-white'
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        color: '#ef4444', // red-500
        variant: 'destructive',
    },
    negotiating: {
        label: 'Negotiating',
        icon: Clock,
        color: '#a855f7', // purple-500
        variant: 'secondary',
        className: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    default: {
        label: 'Unknown',
        icon: HelpCircle,
        color: '#71717a', // zinc-500
        variant: 'secondary',
    }
};

export const getStatusInfo = (status: string): StatusInfo => {
    return statusMap[status] || statusMap.default;
};
