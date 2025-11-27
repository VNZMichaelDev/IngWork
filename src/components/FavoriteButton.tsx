"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  userId: string;
  favoriteUserId: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function FavoriteButton({
  userId,
  favoriteUserId,
  size = "default",
  className = "",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkIfFavorite();
  }, [userId, favoriteUserId]);

  const checkIfFavorite = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("favorited_user_id", favoriteUserId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error(fetchError);
        return;
      }

      setIsFavorite(!!data);
    } catch (err) {
      console.error("Error checking favorite:", err);
    }
  };

  const handleToggleFavorite = async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();

      if (isFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("favorited_user_id", favoriteUserId);

        if (deleteError) throw deleteError;
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from("favorites")
          .insert({
            user_id: userId,
            favorited_user_id: favoriteUserId,
          });

        if (insertError) throw insertError;
        setIsFavorite(true);
      }
    } catch (err) {
      setError("Error actualizando favorito");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`${className} ${isFavorite ? "text-red-500" : "text-gray-400"}`}
      title={isFavorite ? "Remover de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
      />
    </Button>
  );
}
