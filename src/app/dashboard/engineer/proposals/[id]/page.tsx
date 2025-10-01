"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  client: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

interface Proposal {
  id: string;
  bid_amount: number;
  eta_days: number;
  details: string;
  status: string;
  created_at: string;
}

export default function ProposalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProposalDetails();
  }, []);

  const loadProposalDetails = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { user } = await authClient.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get proposal details
      const { data: proposalData, error: proposalError } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", params.id)
        .eq("engineer_id", user.id)
        .single();

      if (proposalError) {
        setError("Error cargando propuesta");
        return;
      }

      setProposal(proposalData);

      // Get project and client details
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select(`
          *,
          client:profiles!projects_client_id_fkey(full_name, email, phone)
        `)
        .eq("id", proposalData.project_id)
        .single();

      if (projectError) {
        setError("Error cargando proyecto");
        return;
      }

      setProject(projectData);
    } catch (err) {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "negotiating": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted": return "Aceptada";
      case "rejected": return "Rechazada";
      case "negotiating": return "En negociación";
      default: return "Enviada";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !project || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Propuesta no encontrada"}</p>
          <Link href="/dashboard/engineer">
            <Button>Volver al Dashboard</Button>
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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                ConstruMatch
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Detalles de Propuesta</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hola, Ingeniero</span>
              <Link href="/dashboard/engineer">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/dashboard/engineer"
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base flex items-center font-medium"
          >
            ← Volver al Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Project Details */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pr-4">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(proposal.status)}`}>
                  {getStatusText(proposal.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Categoría</p>
                  <p className="font-medium">{project.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p className="font-medium">{project.location || "Remoto"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Presupuesto del Cliente</p>
                  <p className="font-medium">${project.budget_estimate?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tiempo Estimado</p>
                  <p className="font-medium">{project.eta_days} días</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Descripción del Proyecto</h3>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>
            </div>

            {/* Your Proposal */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Tu Propuesta</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tu Oferta</p>
                  <p className="text-2xl font-bold text-green-600">${proposal.bid_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tu Tiempo Estimado</p>
                  <p className="text-xl font-semibold">{proposal.eta_days} días</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Detalles de tu propuesta</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{proposal.details}</p>
              </div>

              <p className="text-sm text-gray-500">
                Enviada el {new Date(proposal.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Client Info & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Información del Cliente</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium">{project.client.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{project.client.email}</p>
                </div>
                {project.client.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{project.client.phone}</p>
                  </div>
                )}
              </div>

              {proposal.status === "accepted" && (
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => window.open(`mailto:${project.client.email}`, '_blank')}
                  >
                    Contactar por Email
                  </Button>
                  
                  {project.client.phone && (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(`tel:${project.client.phone}`, '_blank')}
                      >
                        📞 Llamar: {project.client.phone}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => {
                          const phone = project.client.phone?.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                          const message = `Hola ${project.client.full_name}, soy el ingeniero que envió la propuesta para el proyecto "${project.title}". Mi propuesta fue aceptada y me gustaría coordinar los detalles del trabajo.`;
                          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        💬 Escribir por WhatsApp
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {proposal.status === "sent" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Propuesta Enviada</h4>
                <p className="text-sm text-blue-700">
                  Tu propuesta está siendo revisada por el cliente. Te notificaremos cuando haya una respuesta.
                </p>
              </div>
            )}

            {proposal.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Propuesta Rechazada</h4>
                <p className="text-sm text-red-700">
                  Lamentablemente esta propuesta no fue seleccionada. ¡Sigue buscando otros proyectos!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
