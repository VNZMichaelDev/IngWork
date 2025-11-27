"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, Profile } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowLeft, FileText, Eye, CheckCircle } from "lucide-react";
import Link from "next/link";

interface EngineerWithDocs extends Profile {
  has_cv: boolean;
  has_dni: boolean;
  has_carnet: boolean;
}

export default function AdminDocumentsPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [engineers, setEngineers] = useState<EngineerWithDocs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified">("all");
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

      // Load engineers with documents
      const supabase = createSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "engineer")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const engineersWithDocs: EngineerWithDocs[] = (data || []).map((eng) => ({
        ...eng,
        has_cv: !!eng.cv_url,
        has_dni: !!eng.dni_url,
        has_carnet: !!eng.colegio_carnet_url,
      }));

      setEngineers(engineersWithDocs);
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
      loadData();
    } catch (err) {
      setError("Error verificando ingeniero");
      console.error(err);
    }
  };

  const filteredEngineers = engineers.filter((eng) => {
    if (filterStatus === "pending") {
      return !eng.is_verified && (eng.has_cv || eng.has_dni || eng.has_carnet);
    }
    if (filterStatus === "verified") {
      return eng.is_verified;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando documentos...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Documentos de Ingenieros</h1>
            <p className="text-sm text-gray-600">Total: {filteredEngineers.length}</p>
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

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            size="sm"
          >
            Todos ({engineers.length})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => setFilterStatus("pending")}
            size="sm"
          >
            Pendientes (
            {engineers.filter((e) => !e.is_verified && (e.has_cv || e.has_dni || e.has_carnet))
              .length}
            )
          </Button>
          <Button
            variant={filterStatus === "verified" ? "default" : "outline"}
            onClick={() => setFilterStatus("verified")}
            size="sm"
          >
            Verificados ({engineers.filter((e) => e.is_verified).length})
          </Button>
        </div>

        {filteredEngineers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No hay documentos para mostrar.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEngineers.map((engineer) => (
              <div
                key={engineer.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {engineer.full_name}
                      </h3>
                      {engineer.is_verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Verificado
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{engineer.email}</p>

                    {/* Document Status Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* CV */}
                      <div
                        className={`border rounded-lg p-4 ${
                          engineer.has_cv ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900">CV</span>
                          </div>
                          {engineer.has_cv && (
                            <span className="text-xs font-medium text-green-600">✓</span>
                          )}
                        </div>
                        {engineer.has_cv ? (
                          <a
                            href={engineer.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            Ver documento
                          </a>
                        ) : (
                          <p className="text-xs text-gray-600">No cargado</p>
                        )}
                      </div>

                      {/* DNI */}
                      <div
                        className={`border rounded-lg p-4 ${
                          engineer.has_dni ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-gray-900">DNI</span>
                          </div>
                          {engineer.has_dni && (
                            <span className="text-xs font-medium text-green-600">✓</span>
                          )}
                        </div>
                        {engineer.has_dni ? (
                          <a
                            href={engineer.dni_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            Ver documento
                          </a>
                        ) : (
                          <p className="text-xs text-gray-600">No cargado</p>
                        )}
                      </div>

                      {/* Carnet */}
                      <div
                        className={`border rounded-lg p-4 ${
                          engineer.has_carnet ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-gray-900">Carnet</span>
                          </div>
                          {engineer.has_carnet && (
                            <span className="text-xs font-medium text-green-600">✓</span>
                          )}
                        </div>
                        {engineer.has_carnet ? (
                          <a
                            href={engineer.colegio_carnet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            Ver documento
                          </a>
                        ) : (
                          <p className="text-xs text-gray-600">No cargado</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!engineer.is_verified &&
                    engineer.has_cv &&
                    engineer.has_dni &&
                    engineer.has_carnet && (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(engineer.id)}
                        className="ml-4 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verificar
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
