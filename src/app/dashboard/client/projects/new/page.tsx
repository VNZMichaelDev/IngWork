"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const categories = [
  "Construcción",
  "Mantenimiento y mejoramiento",
  "Remodelación",
  "Servicios técnicos y documentación",
  "Asesorías y consultorías",
  "Supervisión",
  "Categoría A - Edificaciones esenciales",
  "Categoría B - Edificaciones de uso especial",
  "Categoría C - Edificaciones comunes",
  "Categoría D - Edificaciones menores"
];

export default function NewProjectPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budgetEstimate, setBudgetEstimate] = useState("");
  const [etaDays, setEtaDays] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { user } = await authClient.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { profile } = await authClient.getProfile(user.id);
      if (!profile || profile.role !== "client") {
        router.push("/auth/login");
        return;
      }

      setUser(user);
    } catch (err) {
      console.error("Error loading user data:", err);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!user) return;

    try {
      const supabase = createSupabaseBrowserClient();
      
      const projectData = {
        client_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        budget_estimate: budgetEstimate ? parseFloat(budgetEstimate) : null,
        eta_days: etaDays ? parseInt(etaDays) : null,
        location: location.trim() || null,
        status: "open"
      };

      const { data, error } = await supabase
        .from("projects")
        .insert(projectData)
        .select()
        .single();

      if (error) {
        setError("Error creando el proyecto: " + error.message);
        return;
      }

      router.push(`/dashboard/client/projects/${data.id}`);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                ConstruMatch
              </Link>
              <span className="ml-4 text-gray-500">Crear Proyecto</span>
            </div>
            <Link href="/dashboard/client">
              <Button variant="outline" size="sm">
                ← Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Proyecto</h1>
            <p className="text-gray-600 mt-2">
              Describe tu proyecto para que los ingenieros puedan enviar propuestas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título del proyecto *
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="ej. Desarrollo de aplicación web para gestión de inventario"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción detallada *
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe en detalle qué necesitas, los requisitos técnicos, funcionalidades esperadas, etc."
                rows={6}
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/2000 caracteres
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budgetEstimate" className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto estimado (USD)
                </label>
                <Input
                  id="budgetEstimate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={budgetEstimate}
                  onChange={(e) => setBudgetEstimate(e.target.value)}
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="etaDays" className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo estimado (días)
                </label>
                <Input
                  id="etaDays"
                  type="number"
                  min="1"
                  max="365"
                  value={etaDays}
                  onChange={(e) => setEtaDays(e.target.value)}
                  placeholder="30"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación (opcional)
                </label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ciudad, País"
                />
              </div>
            </div>


            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Link href="/dashboard/client" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Creando..." : "Crear Proyecto"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
