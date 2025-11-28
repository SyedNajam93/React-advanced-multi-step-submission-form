import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ArrowDown, ArrowUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const priorities = [
  { 
    value: 'low', 
    label: 'Low', 
    icon: ArrowDown,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    activeColor: 'bg-green-500'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    icon: ArrowUp,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    activeColor: 'bg-yellow-500'
  },
  { 
    value: 'high', 
    label: 'High', 
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    activeColor: 'bg-orange-500'
  },
  { 
    value: 'urgent', 
    label: 'Urgent', 
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    activeColor: 'bg-red-500'
  }
];

export default function PrioritySelector({ value, onChange, label = 'Priority' }) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {priorities.map((priority) => {
          const isSelected = value === priority.value;
          const Icon = priority.icon;
          
          return (
            <motion.button
              key={priority.value}
              type="button"
              onClick={() => onChange(priority.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl",
                "border-2 transition-all duration-300",
                isSelected
                  ? `${priority.borderColor} ${priority.bgColor} shadow-md`
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg mb-2 transition-colors duration-300",
                isSelected ? priority.bgColor : "bg-gray-100"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isSelected ? priority.color : "text-gray-400"
                )} />
              </div>
              
              <span className={cn(
                "text-sm font-medium transition-colors duration-300",
                isSelected ? priority.color : "text-gray-600"
              )}>
                {priority.label}
              </span>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="priority-indicator"
                  className={cn(
                    "absolute -top-1 -right-1 w-4 h-4 rounded-full",
                    priority.activeColor
                  )}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}