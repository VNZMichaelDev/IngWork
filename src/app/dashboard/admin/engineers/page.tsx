"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, Profile } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle, AlertCircle, Eye, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminEngineersPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [engineers, setEngineers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { user } = await authClient.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { profile } = await authClient.getProfile(user.id);
      if (!profile || !profile.is_admin) {
        router.push("/dashboard/engineer");
        return;
      }

      setUser(user);
      setProfile(profile);

      // Load engineers
      const supabase = createSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "engineer")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setEngineers(data || []);
    } catch (err) {
      setError("Error cargando datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (engineerId: string) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", engineerId);

      if (updateError) throw updateError;

      // Reload engineers
      loadData();
    } catch (err) {
      setError("Error verificando ingeniero");
      console.error(err);
    }
  };

  const handleUnverify = async (engineerId: string) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_verified: false })
        .eq("id", engineerId);

      if (updateError) throw updateError;

      // Reload engineers
      loadData();
    } catch (err) {
      setError("Error removiendo verificación");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando ingenieros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ingenieros</h1>
            <p className="text-sm text-gray-600">Total: {engineers.length}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {engineers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No hay ingenieros registrados aún.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {engineers.map((engineer) => (
              <div
                key={engineer.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {engineer.full_name}
                      </h3>
                      {engineer.is_verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Verificado
                        </span>
                      )}
                      {!engineer.is_verified && engineer.cv_url && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{engineer.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Especialidad</p>
                        <p className="font-medium text-gray-900">
                          {engineer.specialty || "No especificada"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Experiencia</p>
                        <p className="font-medium text-gray-900">
                          {engineer.experience_years || 0} años
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Teléfono</p>
                        <p className="font-medium text-gray-900">
                          {engineer.phone || "No proporcionado"}
                        </p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {engineer.cv_url && (
                        <a
                          href={engineer.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          Ver CV
                        </a>
                      )}
                      {engineer.dni_url && (
                        <a
                          href={engineer.dni_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          Ver DNI
                        </a>
                      )}
                      {engineer.colegio_carnet_url && (
                        <a
                          href={engineer.colegio_carnet_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium hover:bg-purple-100 transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          Ver Carnet
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/dashboard/client/engineers/${engineer.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Perfil
                      </Button>
                    </Link>
                    {engineer.is_verified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnverify(engineer.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remover Verificación
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(engineer.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verificar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
