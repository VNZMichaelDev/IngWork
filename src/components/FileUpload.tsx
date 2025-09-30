"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { storageClient, UploadedFile } from "@/lib/storage";

interface FileUploadProps {
  projectId: string;
  userId: string;
  onFileUploaded: (file: UploadedFile) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

export default function FileUpload({ 
  projectId, 
  userId, 
  onFileUploaded, 
  maxFileSize = 10,
  acceptedTypes = [
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.mp4', '.avi', '.mov',
    '.zip', '.rar', '.7z',
    '.xls', '.xlsx', '.ppt', '.pptx'
  ]
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError("");

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`El archivo es demasiado grande. Máximo ${maxFileSize}MB.`);
      setUploading(false);
      return;
    }

    // Validate file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExt)) {
      setError(`Tipo de archivo no permitido. Tipos aceptados: ${acceptedTypes.join(', ')}`);
      setUploading(false);
      return;
    }

    try {
      const { data, error } = await storageClient.uploadFile(projectId, file, userId);
      
      if (error) {
        setError("Error subiendo archivo: " + error.message);
        return;
      }

      if (data) {
        onFileUploaded(data);
      }
    } catch (err) {
      setError("Error inesperado subiendo archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept={acceptedTypes.join(',')}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Subiendo archivo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Máximo {maxFileSize}MB • {acceptedTypes.slice(0, 5).join(', ')}
              {acceptedTypes.length > 5 && ` y ${acceptedTypes.length - 5} más`}
            </p>
            <Button variant="outline" size="sm">
              Seleccionar Archivo
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
