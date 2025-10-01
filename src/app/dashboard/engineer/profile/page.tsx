"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient, Profile } from "@/lib/auth";

const specialties = [
  "Desarrollo Web",
  "Desarrollo Móvil",
  "Diseño UI/UX",
  "Ingeniería Civil",
  "Ingeniería Mecánica",
  "Ingeniería Eléctrica",
  "Arquitectura",
  "Consultoría",
  "Marketing Digital",
  "Otro"
];

export default function EngineerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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
      if (!profile || profile.role !== "engineer") {
        router.push("/auth/login");
        return;
      }

      setUser(user);
      setProfile(profile);

      // Pre-fill form
      setFullName(profile.full_name || "");
      setEmail(profile.email || user.email || "");
      setPhone(profile.phone || "");
      setCompany(profile.company || "");
      setSpecialty(profile.specialty || "");
      setExperienceYears(profile.experience_years?.toString() || "");
      setHourlyRate(profile.hourly_rate?.toString() || "");
      setPortfolioUrl(profile.portfolio_url || "");
      setAvailability(profile.availability || "available");
    } catch (err) {
      setError("Error cargando datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!profile) return;

    try {
      const updates: Partial<Profile> = {
        full_name: fullName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        specialty: specialty || undefined,
        experience_years: experienceYears ? parseInt(experienceYears) : undefined,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        portfolio_url: portfolioUrl.trim() || undefined,
        availability: availability,
      };

      await authClient.updateProfile(profile.id, updates);
      setSuccess("Perfil actualizado exitosamente");
      
      // Reload profile data
      setTimeout(() => {
        loadUserData();
      }, 1000);
    } catch (err) {
      setError("Error actualizando perfil. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
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
              <span className="ml-4 text-gray-500">Mi Perfil</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/engineer">
                <Button variant="outline" size="sm">
                  ← Volver al Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil de Ingeniero</h1>
            <p className="text-gray-600 mt-2">
              Mantén tu perfil actualizado para recibir mejores oportunidades
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

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
                    Empresa
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
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Información Profesional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad *
                  </label>
                  <select
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una especialidad</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div className="mt-6">
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
                <p className="text-xs text-gray-500 mt-1">
                  Comparte tu portafolio para mostrar tu trabajo a los clientes
                </p>
              </div>
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

            <div className="pt-4">
              <Button type="submit" disabled={saving} className="w-full md:w-auto">
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>

          {/* Account Info */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold mb-4">Información de la Cuenta</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tipo de cuenta</p>
                  <p className="font-medium">Ingeniero</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha de registro</p>
                  <p className="font-medium">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">ID de usuario</p>
                  <p className="font-medium font-mono text-xs">{user?.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Estado</p>
                  <p className="font-medium text-green-600">Activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
