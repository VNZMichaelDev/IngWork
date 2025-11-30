"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, Profile } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Users, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalEngineers: 0,
    verifiedEngineers: 0,
    pendingEngineers: 0,
    totalClients: 0,
  });
  const router = useRouter();

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

      // Check if user is admin
      if (!profile.is_admin) {
        router.push("/dashboard/engineer");
        return;
      }

      setUser(user);
      setProfile(profile);

      // Load statistics
      const supabase = createSupabaseBrowserClient();
      
      // Get total engineers
      const { data: engineers, error: engError } = await supabase
        .from("profiles")
        .select("id, is_verified")
        .eq("role", "engineer");

      // Get total clients
      const { data: clients, error: clientError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "client");

      if (!engError && engineers) {
        const verified = engineers.filter(e => e.is_verified).length;
        const pending = engineers.length - verified;
        
        setStats({
          totalEngineers: engineers.length,
          verifiedEngineers: verified,
          pendingEngineers: pending,
          totalClients: clients?.length || 0,
        });
      }
    } catch (err) {
      setError("Error cargando datos del usuario");
      console.error(err);
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
            <p className="text-sm text-gray-600 mt-1">Gestiona ingenieros, clientes y documentos</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              authClient.signOut();
              router.push("/");
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Ingenieros Totales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEngineers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Verificados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.verifiedEngineers}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pendientes de Revisar</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingEngineers}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Clientes Totales</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalClients}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ingenieros */}
          <Link href="/dashboard/admin/engineers">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ingenieros</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Revisa y verifica los perfiles de ingenieros. Valida sus documentos y asigna el badge de verificación.
              </p>
              <Button variant="outline" className="w-full">
                Ir a Ingenieros
              </Button>
            </div>
          </Link>

          {/* Clientes */}
          <Link href="/dashboard/admin/clients">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Visualiza todos los clientes registrados en la plataforma. Monitorea su actividad y proyectos.
              </p>
              <Button variant="outline" className="w-full">
                Ir a Clientes
              </Button>
            </div>
          </Link>

          {/* Documentos */}
          <Link href="/dashboard/admin/documents">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Documentos</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Revisa los documentos subidos por ingenieros. CV, DNI y carnet de colegiatura.
              </p>
              <Button variant="outline" className="w-full">
                Ir a Documentos
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
