"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient, Profile } from "@/lib/auth";

export default function OnboardingPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form fields
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [availability, setAvailability] = useState("available");

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
      if (!profile) {
        router.push("/auth/register");
        return;
      }

      setUser(user);
      setProfile(profile);

      // Pre-fill form with existing data
      setPhone(profile.phone || "");
      setCompany(profile.company || "");
      setSpecialty(profile.specialty || "");
      setExperienceYears(profile.experience_years?.toString() || "");
      setHourlyRate(profile.hourly_rate?.toString() || "");
      setPortfolioUrl(profile.portfolio_url || "");
      setAvailability(profile.availability || "available");
    } catch (err) {
      setError("Error cargando datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!profile) return;

    try {
      const updates: Partial<Profile> = {
        phone: phone || undefined,
        company: company || undefined,
      };

      if (profile.role === "engineer") {
        updates.specialty = specialty || undefined;
        updates.experience_years = experienceYears ? parseInt(experienceYears) : undefined;
        updates.hourly_rate = hourlyRate ? parseFloat(hourlyRate) : undefined;
        updates.portfolio_url = portfolioUrl || undefined;
        updates.availability = availability;
      }

      await authClient.updateProfile(profile.id, updates);

      // Redirect to appropriate dashboard
      if (profile.role === "client") {
        router.push("/dashboard/client");
      } else {
        router.push("/dashboard/engineer");
      }
    } catch (err) {
      setError("Error guardando perfil. Intenta de nuevo.");
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error cargando perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Completa tu perfil</h1>
            <p className="text-gray-600 mt-2">
              {profile.role === "client" 
                ? "Añade información adicional para mejorar tu experiencia como cliente"
                : "Completa tu perfil profesional para recibir mejores propuestas"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa {profile.role === "client" ? "(opcional)" : ""}
                </label>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nombre de tu empresa"
                />
              </div>
            </div>

            {profile.role === "engineer" && (
              <>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad *
                  </label>
                  <Input
                    id="specialty"
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    placeholder="ej. Desarrollo Web, Ingeniería Civil, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                      Años de experiencia
                    </label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min="0"
                      max="50"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tarifa por hora (USD)
                    </label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="50.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL del portafolio
                  </label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://tu-portafolio.com"
                  />
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidad
                  </label>
                  <select
                    id="availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="available">Disponible</option>
                    <option value="busy">Ocupado</option>
                    <option value="unavailable">No disponible</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (profile.role === "client") {
                    router.push("/dashboard/client");
                  } else {
                    router.push("/dashboard/engineer");
                  }
                }}
                className="flex-1"
              >
                Saltar por ahora
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Guardando..." : "Completar perfil"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
