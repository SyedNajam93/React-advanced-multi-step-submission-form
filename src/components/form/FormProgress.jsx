import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FormProgress({ steps, currentStep, onStepClick }) {
  return (
    <div className="w-full mb-12">
      {/* Progress bar background */}
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100" />
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        
        {/* Step indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <button
                key={step.id}
                onClick={() => index <= currentStep && onStepClick(index)}
                disabled={index > currentStep}
                className={cn(
                  "flex flex-col items-center group",
                  index <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
                )}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted 
                      ? '#4F46E5' 
                      : isCurrent 
                        ? '#4F46E5' 
                        : '#F3F4F6'
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "transition-shadow duration-300",
                    isCurrent && "ring-4 ring-indigo-100 shadow-lg shadow-indigo-200/50",
                    isCompleted && "shadow-md"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={cn(
                      "text-sm font-semibold",
                      isCurrent ? "text-white" : "text-gray-400"
                    )}>
                      {index + 1}
                    </span>
                  )}
                </motion.div>
                
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    isCurrent ? "text-indigo-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
                    {step.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}