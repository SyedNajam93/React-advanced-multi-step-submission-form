import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

const getFileIcon = (type) => {
  if (type?.startsWith('image/')) return Image;
  if (type?.includes('pdf')) return FileText;
  return File;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileUploadField({ value = [], onChange, maxFiles = 5, accept = "*" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const uploadFile = async (file) => {
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    return {
      url: file_url,
      name: file.name,
      size: file.size,
      type: file.type
    };
  };

  const handleFiles = async (files) => {
    if (value.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    const uploadedFiles = [];

    for (const file of files) {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      const uploaded = await uploadFile(file);
      uploadedFiles.push(uploaded);
      
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
    }

    onChange([...value, ...uploadedFiles]);
    setUploading(false);
    setUploadProgress({});
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = [...e.dataTransfer.files];
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [value, onChange, maxFiles]);

  const handleInputChange = (e) => {
    const files = [...e.target.files];
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (index) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-40",
          "border-2 border-dashed rounded-2xl cursor-pointer",
          "transition-all duration-300 ease-out",
          isDragging 
            ? "border-indigo-400 bg-indigo-50/50" 
            : "border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <motion.div
          animate={{ 
            y: isDragging ? -5 : 0,
            scale: isDragging ? 1.1 : 1 
          }}
          className="flex flex-col items-center"
        >
          {uploading ? (
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          ) : (
            <div className={cn(
              "p-3 rounded-xl mb-3 transition-colors duration-300",
              isDragging ? "bg-indigo-100" : "bg-gray-100"
            )}>
              <Upload className={cn(
                "w-6 h-6 transition-colors duration-300",
                isDragging ? "text-indigo-600" : "text-gray-400"
              )} />
            </div>
          )}
          
          <p className="text-sm font-medium text-gray-700">
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {value.length}/{maxFiles} files • Max 10MB each
          </p>
        </motion.div>
      </motion.label>

      {/* File list */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {value.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <motion.div
                  key={file.url || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl",
                    "bg-white border border-gray-100 shadow-sm",
                    "hover:shadow-md transition-shadow duration-300"
                  )}
                >
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <FileIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}