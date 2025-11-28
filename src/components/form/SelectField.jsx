import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  required,
  icon: Icon,
  helpText
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isValid = hasValue && !error;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label 
          htmlFor={name}
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            isFocused ? "text-indigo-600" : "text-gray-700"
          )}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-1 text-green-500"
            >
              <Check className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Valid</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        {Icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors duration-300",
            isFocused ? "text-indigo-500" : "text-gray-400"
          )}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <Select
          value={value}
          onValueChange={onChange}
          onOpenChange={(open) => setIsFocused(open)}
        >
          <SelectTrigger
            className={cn(
              "w-full h-12 px-4 rounded-xl border-2 transition-all duration-300",
              "bg-white text-gray-800",
              Icon && "pl-11",
              error 
                ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100" 
                : isFocused 
                  ? "border-indigo-400 ring-4 ring-indigo-100" 
                  : isValid
                    ? "border-green-300"
                    : "border-gray-200 hover:border-gray-300"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="rounded-lg cursor-pointer focus:bg-indigo-50 focus:text-indigo-700"
              >
                <div className="flex items-center gap-2">
                  {option.icon && <option.icon className="w-4 h-4" />}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Help text or error */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        ) : helpText ? (
          <motion.p
            key="help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400"
          >
            {helpText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}