"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { authClient } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Engineer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  specialty: string;
  experience_years: number;
  hourly_rate: string;
  portfolio_url: string;
  availability: string;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    full_name: string;
  };
  project: {
    title: string;
  };
}

export default function EngineerPublicProfilePage() {
  const params = useParams();
  const engineerId = params.id as string;
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadEngineerData();
  }, [engineerId]);

  const loadEngineerData = async () => {
    try {
      const { user } = await authClient.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const supabase = createSupabaseBrowserClient();

      // Cargar datos del ingeniero
      const { data: engineerData, error: engineerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", engineerId)
        .eq("role", "engineer")
        .single();

      if (engineerError || !engineerData) {
        console.error("Error loading engineer:", engineerError);
        return;
      }

      setEngineer(engineerData);

      // Cargar calificaciones del ingeniero
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:reviewer_id (
            full_name
          ),
          project:project_id (
            title
          )
        `)
        .eq("reviewee_id", engineerId)
        .order("created_at", { ascending: false });

      if (reviewsData) {
        setReviews(reviewsData as any);
        
        // Calcular promedio de calificaciones
        if (reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
          setAverageRating(Math.round(avg * 10) / 10); // Redondear a 1 decimal
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Disponible";
      case "busy":
        return "Ocupado";
      case "unavailable":
        return "No disponible";
      default:
        return availability;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!engineer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ingeniero no encontrado</h2>
          <Link href="/dashboard/client/engineers">
            <Button>Volver a búsqueda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Botón Volver */}
        <div className="mb-6">
          <Link href="/dashboard/client/engineers">
            <Button variant="outline">
              ← Volver a búsqueda
            </Button>
          </Link>
        </div>

        {/* Perfil del Ingeniero */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="bg-blue-100 p-6 rounded-full">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{engineer.full_name}</h1>
                <p className="text-xl text-gray-600 mb-3">{engineer.specialty}</p>
                {engineer.company && (
                  <p className="text-gray-500 mb-3">{engineer.company}</p>
                )}
                
                {/* Calificación promedio */}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={averageRating} readonly size="md" />
                    <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
                    <span className="text-gray-500">({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})</span>
                  </div>
                )}
                
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(engineer.availability)}`}>
                  {getAvailabilityText(engineer.availability)}
                </span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Experiencia</p>
              <p className="text-lg font-semibold">
                {engineer.experience_years ? `${engineer.experience_years} años` : "No especificada"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Carnet de colegiatura</p>
              <p className="text-lg font-semibold">
                {engineer.hourly_rate || "No especificado"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Miembro desde</p>
              <p className="text-lg font-semibold">
                {new Date(engineer.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Portafolio */}
          {engineer.portfolio_url && (
            <div className="mt-6">
              <a
                href={engineer.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Ver portafolio →
              </a>
            </div>
          )}
        </div>

        {/* Sección de Reseñas */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              Reseñas y Calificaciones ({reviews.length})
            </h2>
          </div>

          <div className="p-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aún no hay reseñas
                </h3>
                <p className="text-gray-600">
                  Este ingeniero aún no ha recibido calificaciones
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-gray-900">
                            {review.reviewer?.full_name || "Cliente"}
                          </p>
                          <StarRating rating={review.rating} readonly size="sm" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Proyecto: {review.project?.title || "Sin título"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
