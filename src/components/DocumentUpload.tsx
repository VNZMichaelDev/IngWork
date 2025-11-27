"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { storageClient, UploadedFile } from "@/lib/storage";
import { Eye, X, CheckCircle } from "lucide-react";

interface DocumentUploadProps {
  userId: string;
  documentType: "cv" | "dni" | "colegio_carnet";
  onFileUploaded: (file: UploadedFile) => void;
  existingUrl?: string;
  label: string;
  description?: string;
}

export default function DocumentUpload({
  userId,
  documentType,
  onFileUploaded,
  existingUrl,
  label,
  description,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError("");

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Máximo 10MB.");
      setUploading(false);
      return;
    }

    // Validate file type - only PDF for documents
    if (file.type !== "application/pdf") {
      setError("Solo se aceptan archivos PDF.");
      setUploading(false);
      return;
    }

    try {
      const bucket = "engineer-documents";
      const path = `${userId}/${documentType}/${Date.now()}_${file.name}`;

      const supabase = (await import("@/lib/supabase/client")).createSupabaseBrowserClient();
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError("Error subiendo archivo: " + uploadError.message);
        return;
      }

      if (data) {
        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);

        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicData.publicUrl,
        };

        setPreviewUrl(publicData.publicUrl);
        onFileUploaded(uploadedFile);
      }
    } catch (err) {
      setError("Error inesperado subiendo archivo");
      console.error(err);
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

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} *
        </label>
        {description && (
          <p className="text-xs text-gray-500 mb-2">{description}</p>
        )}
      </div>

      {previewUrl ? (
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Documento cargado
                </p>
                <p className="text-xs text-gray-600">
                  {previewUrl.split("/").pop()?.substring(0, 30)}...
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-green-100 rounded transition-colors"
                title="Ver documento"
              >
                <Eye className="w-4 h-4 text-green-600" />
              </a>
              <button
                onClick={handleRemove}
                className="p-2 hover:bg-red-100 rounded transition-colors"
                title="Eliminar documento"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ) : (
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
            accept=".pdf"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Subiendo documento...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-1">
                Arrastra tu PDF aquí
              </p>
              <p className="text-sm text-gray-500 mb-4">
                o haz clic para seleccionar
              </p>
              <Button variant="outline" size="sm">
                Seleccionar PDF
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Máximo 10MB • Solo PDF
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
