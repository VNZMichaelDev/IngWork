"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient, Profile } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_estimate: number;
  status: string;
  created_at: string;
  _count?: {
    proposals: number;
  };
}

export default function ClientDashboard() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
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
      if (!profile || profile.role !== "client") {
        router.push("/auth/login");
        return;
      }

      setUser(user);
      setProfile(profile);

      // Load projects
      const supabase = createSupabaseBrowserClient();
      const { data: projectsData, error } = await supabase
        .from("projects")
        .select(`
          *,
          proposals(count)
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error);
      } else {
        setProjects(projectsData || []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "in_progress":
        return "En progreso";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
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
              <span className="ml-4 text-gray-500">Panel Cliente</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {profile?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido a tu panel de cliente
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus proyectos y encuentra ingenieros talentosos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/client/projects/new"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Crear Proyecto</h3>
                <p className="text-gray-600 text-sm">Publica un nuevo proyecto</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/client/engineers"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Buscar Ingenieros</h3>
                <p className="text-gray-600 text-sm">Encuentra profesionales</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/client/profile"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Mi Perfil</h3>
                <p className="text-gray-600 text-sm">Editar información</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Mis Proyectos</h2>
              <Link href="/dashboard/client/projects/new">
                <Button size="sm">Nuevo Proyecto</Button>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes proyectos aún</h3>
                <p className="text-gray-600 mb-4">Crea tu primer proyecto para empezar a recibir propuestas</p>
                <Link href="/dashboard/client/projects/new">
                  <Button>Crear Primer Proyecto</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Categoría: {project.category}</span>
                          <span>Presupuesto: ${project.budget_estimate?.toLocaleString()}</span>
                          <span>{project._count?.proposals || 0} propuestas</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link href={`/dashboard/client/projects/${project.id}`}>
                          <Button variant="outline" size="sm">Ver Detalles</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
