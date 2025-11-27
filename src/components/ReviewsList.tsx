"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
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
  profiles?: any;
}

interface ReviewsListProps {
  userId: string;
  maxReviews?: number;
}

export default function ReviewsList({ userId, maxReviews = 5 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [userId]);

  const loadReviews = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          rating,
          title,
          comment,
          communication_rating,
          quality_rating,
          timeliness_rating,
          professionalism_rating,
          reviewer_id,
          created_at,
          profiles:reviewer_id(full_name, avatar_url)
        `
        )
        .eq("reviewee_id", userId)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(maxReviews);

      if (error) throw error;

      setReviews(data || []);

      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
        setTotalReviews(data.length);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No hay reseñas aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Calificación promedio</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Basado en {totalReviews} reseña{totalReviews !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">
                  {review.profiles?.full_name || "Usuario anónimo"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.created_at).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {review.title && (
              <p className="font-medium text-gray-900 mb-2">{review.title}</p>
            )}

            {review.comment && (
              <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
            )}

            {/* Category Ratings */}
            {(review.communication_rating ||
              review.quality_rating ||
              review.timeliness_rating ||
              review.professionalism_rating) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-100 text-xs">
                {review.communication_rating && (
                  <div>
                    <p className="text-gray-600">Comunicación</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.communication_rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {review.quality_rating && (
                  <div>
                    <p className="text-gray-600">Calidad</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.quality_rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {review.timeliness_rating && (
                  <div>
                    <p className="text-gray-600">Puntualidad</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.timeliness_rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {review.professionalism_rating && (
                  <div>
                    <p className="text-gray-600">Profesionalismo</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.professionalism_rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
