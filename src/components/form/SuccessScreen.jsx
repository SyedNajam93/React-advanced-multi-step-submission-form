import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function SuccessScreen({ submissionId, onNewSubmission }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Animated success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 15,
          delay: 0.1 
        }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-200">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
        </div>
        
        {/* Floating sparkles */}
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
        <motion.div
          animate={{ 
            y: [5, -5, 5],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -bottom-1 -left-3"
        >
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </motion.div>
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900">
          Submission Successful!
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your form has been submitted successfully. We'll review your submission and get back to you shortly.
        </p>
      </motion.div>

      {/* Submission ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 rounded-2xl px-6 py-4 mb-8"
      >
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          Reference Number
        </p>
        <p className="text-lg font-mono font-semibold text-indigo-600">
          #{submissionId?.slice(0, 8).toUpperCase()}
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          onClick={onNewSubmission}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl text-base font-medium shadow-lg shadow-indigo-200 hover:shadow-xl transition-all duration-300"
        >
          New Submission
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}