"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
  reviewer_id: string;
  created_at: string;
}

interface EnhancedRatingSystemProps {
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  revieweeName?: string;
  onReviewSubmitted?: () => void;
}

export default function EnhancedRatingSystem({
  projectId,
  reviewerId,
  revieweeId,
  revieweeName = "Usuario",
  onReviewSubmitted,
}: EnhancedRatingSystemProps) {
  const [showForm, setShowForm] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [communicationRating, setCommunicationRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [timelinessRating, setTimelinessRating] = useState(5);
  const [professionalismRating, setProfessionalismRating] = useState(5);

  useEffect(() => {
    checkExistingReview();
  }, [projectId, reviewerId, revieweeId]);

  const checkExistingReview = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("*")
        .eq("project_id", projectId)
        .eq("reviewer_id", reviewerId)
        .eq("reviewee_id", revieweeId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error(fetchError);
        return;
      }

      if (data) {
        setExistingReview(data);
        setRating(data.rating);
        setTitle(data.title || "");
        setComment(data.comment || "");
        setCommunicationRating(data.communication_rating || 5);
        setQualityRating(data.quality_rating || 5);
        setTimelinessRating(data.timeliness_rating || 5);
        setProfessionalismRating(data.professionalism_rating || 5);
      }
    } catch (err) {
      console.error("Error checking review:", err);
    }
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();

      const reviewData = {
        project_id: projectId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        title: title || undefined,
        comment: comment || undefined,
        communication_rating: communicationRating,
        quality_rating: qualityRating,
        timeliness_rating: timelinessRating,
        professionalism_rating: professionalismRating,
      };

      if (existingReview) {
        // Update existing review
        const { error: updateError } = await supabase
          .from("reviews")
          .update(reviewData)
          .eq("id", existingReview.id);

        if (updateError) throw updateError;
      } else {
        // Create new review
        const { error: insertError } = await supabase
          .from("reviews")
          .insert(reviewData);

        if (insertError) throw insertError;
      }

      setShowForm(false);
      checkExistingReview();
      onReviewSubmitted?.();
    } catch (err) {
      setError("Error guardando reseña");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (val: number) => void;
    label?: string;
  }) => (
    <div>
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (existingReview && !showForm) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Tu reseña</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= existingReview.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(true)}
            className="text-blue-600"
          >
            Editar
          </Button>
        </div>
        {existingReview.title && (
          <p className="font-medium text-gray-900 mb-1">{existingReview.title}</p>
        )}
        {existingReview.comment && (
          <p className="text-sm text-gray-700">{existingReview.comment}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {existingReview ? "Editar reseña" : "Calificar a"} {revieweeName}
        </h3>
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showForm && (
        <div className="space-y-6">
          {/* Main Rating */}
          <StarRating
            value={rating}
            onChange={setRating}
            label="Calificación General"
          />

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título (opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Excelente trabajo"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={4}
            />
          </div>

          {/* Category Ratings */}
          <div className="border-t pt-6">
            <p className="text-sm font-medium text-gray-900 mb-4">
              Calificaciones por categoría
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StarRating
                value={communicationRating}
                onChange={setCommunicationRating}
                label="Comunicación"
              />
              <StarRating
                value={qualityRating}
                onChange={setQualityRating}
                label="Calidad del trabajo"
              />
              <StarRating
                value={timelinessRating}
                onChange={setTimelinessRating}
                label="Puntualidad"
              />
              <StarRating
                value={professionalismRating}
                onChange={setProfessionalismRating}
                label="Profesionalismo"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading
                ? "Guardando..."
                : existingReview
                  ? "Actualizar reseña"
                  : "Publicar reseña"}
            </Button>
          </div>
        </div>
      )}

      {!showForm && !existingReview && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Escribir reseña
        </Button>
      )}
    </div>
  );
}
