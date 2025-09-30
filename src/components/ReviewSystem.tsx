"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    full_name: string;
    role: string;
  };
  reviewee: {
    full_name: string;
    role: string;
  };
}

interface ReviewSystemProps {
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ projectId, reviewerId, revieweeId, onReviewSubmitted }: ReviewSystemProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (rating === 0) {
      setError("Por favor selecciona una calificación");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      
      const { error } = await supabase
        .from("reviews")
        .insert({
          project_id: projectId,
          reviewer_id: reviewerId,
          reviewee_id: revieweeId,
          rating,
          comment: comment.trim() || null,
        });

      if (error) {
        setError("Error enviando reseña: " + error.message);
        return;
      }

      setSuccess("Reseña enviada exitosamente");
      setRating(0);
      setComment("");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Dejar una reseña</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 && "Muy malo"}
              {rating === 2 && "Malo"}
              {rating === 3 && "Regular"}
              {rating === 4 && "Bueno"}
              {rating === 5 && "Excelente"}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comentario (opcional)
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia trabajando en este proyecto..."
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

        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar Reseña"}
        </Button>
      </form>
    </div>
  );
}

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reseñas aún</h3>
        <p className="text-gray-600">Las reseñas aparecerán aquí una vez completado el proyecto</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.reviewer.full_name}</span>
                <span className="text-sm text-gray-500">
                  ({review.reviewer.role === 'client' ? 'Cliente' : 'Ingeniero'})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          {review.comment && (
            <p className="text-gray-700">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function StarRating({ rating, size = "md", showText = false }: StarRatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excelente";
    if (rating >= 3.5) return "Muy bueno";
    if (rating >= 2.5) return "Bueno";
    if (rating >= 1.5) return "Regular";
    return "Malo";
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
      <span className={`text-gray-600 ${sizeClasses[size]}`}>
        {rating.toFixed(1)}
      </span>
      {showText && (
        <span className={`text-gray-500 ${sizeClasses[size]}`}>
          ({getRatingText(rating)})
        </span>
      )}
    </div>
  );
}
