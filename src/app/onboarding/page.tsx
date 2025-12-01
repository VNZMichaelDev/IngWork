"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient, Profile } from "@/lib/auth";
import DocumentUpload from "@/components/DocumentUpload";
import { UploadedFile } from "@/lib/storage";

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
  const [countryCode, setCountryCode] = useState("PE");

  // Document uploads
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [dniFile, setDniFile] = useState<UploadedFile | null>(null);
  const [colegioCarnelFile, setColegioCarnelFile] = useState<UploadedFile | null>(null);

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
      setCountryCode(profile.country_code || "PE");

      // Pre-fill documents if they exist
      if (profile.cv_url) {
        setCvFile({ name: "CV", url: profile.cv_url, size: 0, type: "application/pdf" });
      }
      if (profile.dni_url) {
        setDniFile({ name: "DNI", url: profile.dni_url, size: 0, type: "application/pdf" });
      }
      if (profile.colegio_carnet_url) {
        setColegioCarnelFile({ name: "Carnet", url: profile.colegio_carnet_url, size: 0, type: "application/pdf" });
      }
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
      // Validate required fields for engineers
      if (profile.role === "engineer") {
        if (!specialty) {
          setError("La especialidad es requerida");
          setSaving(false);
          return;
        }
        if (!cvFile) {
          setError("Debes subir tu CV");
          setSaving(false);
          return;
        }
        if (!dniFile) {
          setError("Debes subir una copia de tu DNI");
          setSaving(false);
          return;
        }
        if (!colegioCarnelFile) {
          setError("Debes subir tu carnet de colegio de ingenieros");
          setSaving(false);
          return;
        }
      }

      const updates: Partial<Profile> = {
        phone: phone || undefined,
        company: company || undefined,
        country_code: countryCode,
      };

      if (profile.role === "engineer") {
        updates.specialty = specialty || undefined;
        updates.experience_years = experienceYears ? parseInt(experienceYears) : undefined;
        updates.hourly_rate = hourlyRate ? parseFloat(hourlyRate) : undefined;
        updates.portfolio_url = portfolioUrl || undefined;
        updates.availability = availability;
        // Add document URLs
        updates.cv_url = cvFile?.url;
        updates.dni_url = dniFile?.url;
        updates.colegio_carnet_url = colegioCarnelFile?.url;
      }

      try {
        // Intentar actualizar usando la API route (evita problemas de RLS)
        const response = await fetch("/api/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: profile.id, updates }),
        });

        if (!response.ok) {
          // Si falla, intentar con authClient como fallback
          await authClient.updateProfile(profile.id, updates);
        }
      } catch (updateErr) {
        // Si falla la actualización de perfil, intentamos de todas formas
        // porque los PDFs ya se subieron a Storage
        console.warn("Error actualizando perfil (pero los PDFs se subieron):", updateErr);
      }

      // Redirect to appropriate dashboard
      if (profile.role === "client") {
        router.push("/dashboard/client");
      } else {
        router.push("/dashboard/engineer");
      }
    } catch (err) {
      setError("Error guardando perfil. Intenta de nuevo.");
      console.error(err);
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
                      Carnet de colegiatura
                    </label>
                    <Input
                      id="hourlyRate"
                      type="text"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="Ej: CIP-12345"
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

                <div>
                  <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="PE">Perú</option>
                    <option value="CO">Colombia</option>
                    <option value="CL">Chile</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">México</option>
                    <option value="ES">España</option>
                  </select>
                </div>

                {/* Documents Section */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📄 Documentos Requeridos
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Sube tus documentos profesionales para validar tu credibilidad. Estos serán revisados por nuestro equipo de administración.
                  </p>

                  <div className="space-y-6">
                    <DocumentUpload
                      userId={profile.id}
                      documentType="cv"
                      label="Currículum Vitae (CV)"
                      description="Sube tu CV en PDF. Máximo 10MB."
                      onFileUploaded={setCvFile}
                      existingUrl={cvFile?.url}
                    />

                    <DocumentUpload
                      userId={profile.id}
                      documentType="dni"
                      label="Copia de DNI"
                      description="Sube una copia clara de tu DNI en PDF. Máximo 10MB."
                      onFileUploaded={setDniFile}
                      existingUrl={dniFile?.url}
                    />

                    <DocumentUpload
                      userId={profile.id}
                      documentType="colegio_carnet"
                      label="Carnet de Colegio de Ingenieros"
                      description="Sube tu carnet de colegiatura en PDF. Máximo 10MB."
                      onFileUploaded={setColegioCarnelFile}
                      existingUrl={colegioCarnelFile?.url}
                    />
                  </div>
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
