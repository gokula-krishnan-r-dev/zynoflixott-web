import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type ProfileImageUploadProps = {
    value: File | string | undefined;
    onChange: (file: File | undefined) => void;
    defaultImage?: string;
    name?: string;
    id?: string;
    className?: string;
    maxSizeInMB?: number;
    allowedFileTypes?: string[];
    errorMessage?: string;
    onError?: (error: string) => void;
};

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    value,
    onChange,
    defaultImage = '/placeholder-avatar.jpg',
    name = 'profileImage',
    id = 'profileImage',
    className = '',
    maxSizeInMB = 5,
    allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    errorMessage,
    onError
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(
        typeof value === 'string' ? value : undefined
    );
    const [error, setError] = useState<string | undefined>(errorMessage);
    const inputRef = useRef<HTMLInputElement>(null);

    // Convert File to URL for preview
    const updatePreview = useCallback((file: File | undefined) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return url;
        }
        return undefined;
    }, []);

    // Handle file selection
    const handleFileChange = useCallback((file: File | undefined) => {
        if (!file) {
            setError(undefined);
            setPreviewUrl(undefined);
            onChange(undefined);
            return;
        }

        // Validate file type
        if (!allowedFileTypes.includes(file.type)) {
            const error = `File type not supported. Please upload ${allowedFileTypes.map(t => t.replace('image/', '.')).join(', ')}`;
            setError(error);
            if (onError) onError(error);
            return;
        }

        // Validate file size
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxSizeInMB) {
            const error = `File size exceeds ${maxSizeInMB}MB limit`;
            setError(error);
            if (onError) onError(error);
            return;
        }

        setError(undefined);
        const url = updatePreview(file);
        onChange(file);

        // Clean up when component unmounts
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [allowedFileTypes, maxSizeInMB, onChange, onError, updatePreview]);

    // Initialize preview from prop on component mount
    React.useEffect(() => {
        if (value instanceof File) {
            updatePreview(value);
        } else if (typeof value === 'string' && value) {
            setPreviewUrl(value);
        }
    }, [value, updatePreview]);

    // Handle drag events
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileChange(files[0]);
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleFileChange(undefined);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={`${className}`}>
            <div
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative cursor-pointer transition-all duration-300 ${previewUrl
                        ? 'hover:opacity-95'
                        : 'border-2 border-dashed hover:bg-gray-800 bg-gray-900 rounded-xl ' +
                        (isDragging ? 'border-main bg-gray-800/80' : 'border-gray-700')
                    }`}
            >
                {/* Hidden file input */}
                <input
                    type="file"
                    id={id}
                    name={name}
                    ref={inputRef}
                    onChange={handleInputChange}
                    accept={allowedFileTypes.join(',')}
                    className="hidden"
                />

                {/* Preview Area */}
                <AnimatePresence>
                    {previewUrl ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative aspect-square overflow-hidden rounded-xl flex items-center justify-center"
                        >
                            <Image
                                src={previewUrl}
                                alt="Profile preview"
                                width={200}
                                height={200}
                                className="w-full h-full object-cover bg-black"
                            />

                            {/* Overlay with Remove Button */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                <button
                                    onClick={removeImage}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    aria-label="Remove image"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Success Indicator */}
                            <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                                <Check size={16} className="text-white" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-6 aspect-square min-h-[180px]"
                        >
                            <div className="rounded-full bg-gray-800 p-3 mb-3">
                                <Camera size={24} className="text-main" />
                            </div>
                            <p className="text-center text-gray-300 text-sm font-medium mb-1">
                                Upload profile picture
                            </p>
                            <p className="text-center text-gray-500 text-xs">
                                Drag & drop or click to browse
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <Upload size={14} className="text-gray-500" />
                                <p className="text-xs text-gray-500">
                                    {allowedFileTypes.map(t => t.replace('image/', '.')).join(', ')} (max {maxSizeInMB}MB)
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 mt-2 text-red-500 text-xs"
                    >
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileImageUpload; 