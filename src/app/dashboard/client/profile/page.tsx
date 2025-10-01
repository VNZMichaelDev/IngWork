"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient, Profile } from "@/lib/auth";

export default function ClientProfilePage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
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
      setProfile(profile);

      // Pre-fill form
      setFullName(profile.full_name || "");
      setEmail(profile.email || user.email || "");
      setPhone(profile.phone || "");
      setCompany(profile.company || "");
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
              <Link href="/dashboard/client">
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil de Cliente</h1>
            <p className="text-gray-600 mt-2">
              Actualiza tu información personal y de contacto
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="font-medium">Cliente</p>
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
