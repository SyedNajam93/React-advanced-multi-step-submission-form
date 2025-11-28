import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function CheckboxField({
  label,
  name,
  checked,
  onChange,
  description,
  error
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300",
        "border-2",
        checked 
          ? "border-indigo-200 bg-indigo-50/50" 
          : "border-gray-100 bg-gray-50/30 hover:border-gray-200",
        error && "border-red-200 bg-red-50/30"
      )}
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        id={name}
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "mt-0.5 h-5 w-5 rounded-md border-2 transition-all duration-300",
          checked 
            ? "border-indigo-500 bg-indigo-500 text-white" 
            : "border-gray-300"
        )}
      />
      <div className="flex-1">
        <Label 
          htmlFor={name}
          className={cn(
            "text-sm font-medium cursor-pointer transition-colors duration-300",
            checked ? "text-indigo-700" : "text-gray-700"
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {description}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </motion.div>
  );
}