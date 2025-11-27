"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Heart, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FavoriteProfile {
  id: string;
  full_name: string;
  email: string;
  specialty?: string;
  experience_years?: number;
  avatar_url?: string;
  is_verified?: boolean;
}

interface FavoritesListProps {
  userId: string;
  maxItems?: number;
}

export default function FavoritesList({ userId, maxItems = 6 }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select(
          `
          favorited_user_id,
          profiles:favorited_user_id(
            id,
            full_name,
            email,
            specialty,
            experience_years,
            avatar_url,
            is_verified
          )
        `
        )
        .eq("user_id", userId)
        .limit(maxItems);

      if (fetchError) throw fetchError;

      const profiles = data?.map((fav: any) => fav.profiles).filter(Boolean) || [];
      setFavorites(profiles);
    } catch (err) {
      setError("Error cargando favoritos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteUserId: string) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("favorited_user_id", favoriteUserId);

      if (deleteError) throw deleteError;
      loadFavorites();
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 mb-2">No tienes favoritos aún</p>
        <p className="text-sm text-gray-500">
          Marca ingenieros como favoritos para acceder rápidamente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {favorite.full_name}
                </h3>
                {favorite.specialty && (
                  <p className="text-xs text-gray-600 mt-1">{favorite.specialty}</p>
                )}
              </div>
              <button
                onClick={() => handleRemoveFavorite(favorite.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Remover de favoritos"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            {favorite.experience_years && (
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                <Briefcase className="w-3 h-3" />
                {favorite.experience_years} años de experiencia
              </div>
            )}

            {favorite.is_verified && (
              <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mb-3">
                ✓ Verificado
              </div>
            )}

            <Link href={`/engineers/${favorite.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Ver perfil
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {favorites.length >= maxItems && (
        <div className="text-center">
          <Link href="/favorites">
            <Button variant="outline">Ver todos los favoritos</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
