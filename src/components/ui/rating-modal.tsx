"use client";

import { useState } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { StarRating } from "./star-rating";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  revieweeId: string;
  reviewerId: string;
  revieweeName: string;
  onSuccess: () => void;
}

export function RatingModal({
  isOpen,
  onClose,
  projectId,
  revieweeId,
  reviewerId,
  revieweeName,
  onSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      
      const { error: reviewError } = await supabase
        .from("reviews")
        .insert({
          project_id: projectId,
          reviewer_id: reviewerId,
          reviewee_id: revieweeId,
          rating: rating,
          comment: comment.trim() || null,
        });

      if (reviewError) {
        setError("Error al guardar la calificación: " + reviewError.message);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRating(0);
      setComment("");
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Calificar a {revieweeName}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación *
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comentario (opcional)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia trabajando con este profesional..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1"
            >
              {loading ? "Guardando..." : "Enviar calificación"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
