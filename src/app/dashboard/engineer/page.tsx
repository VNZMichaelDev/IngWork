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
  eta_days: number;
  location: string;
  created_at: string;
  client: {
    full_name: string;
    company: string;
  };
}

interface Proposal {
  id: string;
  bid_amount: number;
  eta_days: number;
  status: string;
  created_at: string;
  project: {
    id: string;
    title: string;
    status: string;
  };
}

export default function EngineerDashboard() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
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
      if (!profile || profile.role !== "engineer") {
        router.push("/auth/login");
        return;
      }

      setUser(user);
      setProfile(profile);

      const supabase = createSupabaseBrowserClient();

      // Load available projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          *,
          profiles:client_id (
            full_name,
            company
          )
        `)
        .eq("status", "pending")
        .eq("privacy", "public")
        .order("created_at", { ascending: false })
        .limit(10);

      if (projectsError) {
        console.error("Error loading projects:", projectsError);
      } else {
        setProjects(projectsData?.map(p => ({
          ...p,
          client: p.profiles
        })) || []);
      }

      // Load user's proposals
      const { data: proposalsData, error: proposalsError } = await supabase
        .from("proposals")
        .select(`
          *,
          projects (
            id,
            title,
            status
          )
        `)
        .eq("engineer_id", user.id)
        .order("created_at", { ascending: false });

      if (proposalsError) {
        console.error("Error loading proposals:", proposalsError);
      } else {
        setProposals(proposalsData?.map(p => ({
          ...p,
          project: p.projects
        })) || []);
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

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "negotiating":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProposalStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Enviada";
      case "negotiating":
        return "Negociando";
      case "accepted":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      case "withdrawn":
        return "Retirada";
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
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
                ConstruMatch
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline text-gray-600">Panel Profesional</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-sm text-gray-600">
                Hola, {profile?.full_name || "Ingeniero"}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="text-xs sm:text-sm">
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
            Panel de Ingeniero
          </h1>
          <p className="text-gray-600 mt-1">
            Encuentra proyectos interesantes y gestiona tus propuestas
          </p>
        </div>

        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{proposals.length}</p>
                <p className="text-gray-600 text-xs sm:text-sm truncate">Propuestas enviadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {proposals.filter(p => p.status === "accepted").length}
                </p>
                <p className="text-gray-600 text-sm">Propuestas aceptadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {proposals.filter(p => p.status === "sent" || p.status === "negotiating").length}
                </p>
                <p className="text-gray-600 text-sm">En proceso</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">{profile?.specialty || "N/A"}</p>
                <p className="text-gray-600 text-sm">Especialidad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "projects"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Proyectos Disponibles ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab("proposals")}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "proposals"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Mis Propuestas ({proposals.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "projects" && (
              <div>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos disponibles</h3>
                    <p className="text-gray-600">Vuelve más tarde para ver nuevos proyectos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span>Categoría: {project.category}</span>
                              {project.budget_estimate && (
                                <span>Presupuesto: ${project.budget_estimate.toLocaleString()}</span>
                              )}
                              {project.eta_days && (
                                <span>Tiempo: {project.eta_days} días</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Cliente: {project.client?.full_name}</span>
                              {project.client?.company && (
                                <span>• {project.client.company}</span>
                              )}
                              {project.location && (
                                <span>• {project.location}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <Link href={`/dashboard/engineer/projects/${project.id}`}>
                              <Button size="sm">Ver Proyecto</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "proposals" && (
              <div>
                {proposals.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No has enviado propuestas aún</h3>
                    <p className="text-gray-600">Explora los proyectos disponibles y envía tu primera propuesta</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{proposal.project?.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProposalStatusColor(proposal.status)}`}>
                                {getProposalStatusText(proposal.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Tu oferta: ${proposal.bid_amount.toLocaleString()}</span>
                              <span>Tiempo: {proposal.eta_days} días</span>
                              <span>Enviada: {new Date(proposal.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Link href={`/dashboard/engineer/proposals/${proposal.id}`}>
                              <Button variant="outline" size="sm">Ver Detalles</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
