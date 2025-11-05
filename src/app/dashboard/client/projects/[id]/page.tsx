"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RatingModal } from "@/components/ui/rating-modal";
import { StarRating } from "@/components/ui/star-rating";
import { authClient } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_estimate: number;
  eta_days: number;
  location: string;
  status: string;
  created_at: string;
}

interface Proposal {
  id: string;
  bid_amount: number;
  eta_days: number;
  details: string;
  status: string;
  created_at: string;
  engineer: {
    id: string;
    full_name: string;
    specialty: string;
    experience_years: number;
    hourly_rate: number;
    company: string;
    portfolio_url: string;
  };
}

export default function ClientProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<{id: string, name: string} | null>(null);
  const [acceptedProposal, setAcceptedProposal] = useState<Proposal | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [projectId]);

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

      const supabase = createSupabaseBrowserClient();

      // Load project details
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("client_id", user.id)
        .single();

      if (projectError) {
        setError("Proyecto no encontrado o no tienes acceso");
        return;
      }

      setProject(projectData);

      // Load proposals for this project
      const { data: proposalsData, error: proposalsError } = await supabase
        .from("proposals")
        .select(`
          *,
          profiles:engineer_id (
            id,
            full_name,
            specialty,
            experience_years,
            hourly_rate,
            company,
            portfolio_url
          )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (proposalsError) {
        console.error("Error loading proposals:", proposalsError);
      } else {
        setProposals(proposalsData?.map(p => ({
          ...p,
          engineer: p.profiles
        })) || []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  const handleProposalAction = async (proposalId: string, action: "accept" | "reject") => {
    setActionLoading(proposalId);
    setError("");
    setSuccess("");

    try {
      const supabase = createSupabaseBrowserClient();
      
      const newStatus = action === "accept" ? "accepted" : "rejected";
      
      const { error } = await supabase
        .from("proposals")
        .update({ status: newStatus })
        .eq("id", proposalId);

      if (error) {
        setError("Error actualizando la propuesta: " + error.message);
        return;
      }

      // If accepting a proposal, update project status and reject other proposals
      if (action === "accept") {
        await supabase
          .from("projects")
          .update({ status: "in_progress" })
          .eq("id", projectId);

        // Reject other proposals
        await supabase
          .from("proposals")
          .update({ status: "rejected" })
          .eq("project_id", projectId)
          .neq("id", proposalId);
        
        // Guardar la propuesta aceptada para poder calificar después
        const acceptedProp = proposals.find(p => p.id === proposalId);
        if (acceptedProp) {
          setAcceptedProposal(acceptedProp);
        }
      }

      setSuccess(action === "accept" ? "Propuesta aceptada" : "Propuesta rechazada");
      
      // Reload data
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setActionLoading(null);
    }
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
      default:
        return status;
    }
  };

  const handleOpenRatingModal = (engineerId: string, engineerName: string) => {
    setSelectedEngineer({ id: engineerId, name: engineerName });
    setShowRatingModal(true);
  };

  const handleRatingSuccess = () => {
    setSuccess("¡Calificación enviada exitosamente!");
    setShowRatingModal(false);
    setSelectedEngineer(null);
    loadData();
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Proyecto no encontrado</p>
          <Link href="/dashboard/client">
            <Button className="mt-4">Volver al Dashboard</Button>
          </Link>
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
              <span className="ml-4 text-gray-500">Gestionar Proyecto</span>
            </div>
            <Link href="/dashboard/client">
              <Button variant="outline" size="sm">
                ← Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>Categoría: {project.category}</span>
                {project.budget_estimate && (
                  <span>Presupuesto: ${project.budget_estimate.toLocaleString()}</span>
                )}
                {project.eta_days && (
                  <span>Tiempo estimado: {project.eta_days} días</span>
                )}
                <span>Publicado: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700">{project.description}</p>
              {project.location && (
                <p className="text-sm text-gray-500 mt-2">Ubicación: {project.location}</p>
              )}
            </div>
            
            {/* Botones de acción según el estado del proyecto */}
            <div className="ml-4 flex gap-2">
              {project.status === "in_progress" && (
                <Button
                  onClick={async () => {
                    const supabase = createSupabaseBrowserClient();
                    await supabase
                      .from("projects")
                      .update({ status: "completed" })
                      .eq("id", projectId);
                    loadData();
                  }}
                  className="bg-green-500 hover:bg-green-600"
                >
                  ✓ Marcar como Completado
                </Button>
              )}
              
              {project.status === "completed" && acceptedProposal && (
                <Button
                  onClick={() => handleOpenRatingModal(acceptedProposal.engineer.id, acceptedProposal.engineer.full_name)}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  ⭐ Calificar Ingeniero
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Proposals Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              Propuestas Recibidas ({proposals.length})
            </h2>
          </div>

          <div className="p-6">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded mb-4">
                {success}
              </div>
            )}

            {proposals.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propuestas aún</h3>
                <p className="text-gray-600">Los ingenieros comenzarán a enviar propuestas pronto</p>
              </div>
            ) : (
              <div className="space-y-6">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{proposal.engineer.full_name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProposalStatusColor(proposal.status)}`}>
                            {getProposalStatusText(proposal.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>Especialidad: {proposal.engineer.specialty}</span>
                          {proposal.engineer.experience_years && (
                            <span>Experiencia: {proposal.engineer.experience_years} años</span>
                          )}
                          {proposal.engineer.company && (
                            <span>Empresa: {proposal.engineer.company}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Oferta</p>
                        <p className="text-lg font-semibold">${proposal.bid_amount.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Tiempo de entrega</p>
                        <p className="text-lg font-semibold">{proposal.eta_days} días</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Carnet de colegiatura</p>
                        <p className="text-lg font-semibold">
                          {proposal.engineer.hourly_rate 
                            ? proposal.engineer.hourly_rate
                            : "No especificado"
                          }
                        </p>
                      </div>
                    </div>

                    {proposal.details && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Detalles de la propuesta:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{proposal.details}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          Enviada: {new Date(proposal.created_at).toLocaleDateString()}
                        </span>
                        {proposal.engineer.portfolio_url && (
                          <a
                            href={proposal.engineer.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Ver portafolio →
                          </a>
                        )}
                      </div>

                      {proposal.status === "sent" && (project.status === "open" || project.status === "pending") && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProposalAction(proposal.id, "reject")}
                            disabled={actionLoading === proposal.id}
                          >
                            {actionLoading === proposal.id ? "..." : "Rechazar"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleProposalAction(proposal.id, "accept")}
                            disabled={actionLoading === proposal.id}
                          >
                            {actionLoading === proposal.id ? "..." : "Aceptar"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Calificación */}
      {showRatingModal && selectedEngineer && user && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          projectId={projectId}
          revieweeId={selectedEngineer.id}
          reviewerId={user.id}
          revieweeName={selectedEngineer.name}
          onSuccess={handleRatingSuccess}
        />
      )}
    </div>
  );
}
