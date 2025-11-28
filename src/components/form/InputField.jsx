import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  icon: Icon,
  helpText,
  rows = 4,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isValid = hasValue && !error;

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-xl border-2 transition-all duration-300",
    "bg-white text-gray-800 placeholder:text-gray-400",
    "focus:outline-none",
    Icon && "pl-11",
    error 
      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100" 
      : isFocused 
        ? "border-indigo-400 ring-4 ring-indigo-100" 
        : isValid
          ? "border-green-300"
          : "border-gray-200 hover:border-gray-300"
  );

  const InputComponent = type === 'textarea' ? Textarea : Input;

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
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
            isFocused ? "text-indigo-500" : "text-gray-400"
          )}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <InputComponent
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={inputClasses}
          rows={type === 'textarea' ? rows : undefined}
          {...props}
        />

        {/* Status indicator */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
            </motion.div>
          )}
        </AnimatePresence>
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