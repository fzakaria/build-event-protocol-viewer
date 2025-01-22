import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onFile: (file: File) => void;
}

export function DropZone({ onFile }: DropZoneProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <div className="mt-4">
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Drop your BEP file here, or click to select
          </span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileInput}
            accept=".bep,.pb,.proto"
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Supports Build Event Protocol binary files
      </p>
    </div>
  );
}