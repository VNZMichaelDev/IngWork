"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    id: string;
    full_name: string;
    company: string;
    email: string;
  };
}

interface ExistingProposal {
  id: string;
  bid_amount: number;
  eta_days: number;
  details: string;
  status: string;
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [existingProposal, setExistingProposal] = useState<ExistingProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Proposal form fields
  const [bidAmount, setBidAmount] = useState("");
  const [etaDays, setEtaDays] = useState("");
  const [details, setDetails] = useState("");

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
      if (!profile || profile.role !== "engineer") {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      const supabase = createSupabaseBrowserClient();

      // Load project details
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select(`
          *,
          profiles:client_id (
            id,
            full_name,
            company,
            email
          )
        `)
        .eq("id", projectId)
        .single();

      if (projectError) {
        setError("Error cargando el proyecto");
        return;
      }

      setProject({
        ...projectData,
        client: projectData.profiles
      });

      // Check if user already has a proposal for this project
      const { data: proposalData, error: proposalError } = await supabase
        .from("proposals")
        .select("*")
        .eq("project_id", projectId)
        .eq("engineer_id", user.id)
        .single();

      if (!proposalError && proposalData) {
        setExistingProposal(proposalData);
        setBidAmount(proposalData.bid_amount.toString());
        setEtaDays(proposalData.eta_days.toString());
        setDetails(proposalData.details || "");
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!user || !project) return;

    try {
      const supabase = createSupabaseBrowserClient();
      
      const proposalData = {
        project_id: projectId,
        engineer_id: user.id,
        bid_amount: parseFloat(bidAmount),
        eta_days: parseInt(etaDays),
        details: details.trim(),
        status: "sent"
      };

      let result;
      if (existingProposal) {
        // Update existing proposal
        result = await supabase
          .from("proposals")
          .update(proposalData)
          .eq("id", existingProposal.id)
          .select()
          .single();
      } else {
        // Create new proposal
        result = await supabase
          .from("proposals")
          .insert(proposalData)
          .select()
          .single();
      }

      if (result.error) {
        setError("Error enviando la propuesta: " + result.error.message);
        return;
      }

      setSuccess(existingProposal ? "Propuesta actualizada exitosamente" : "Propuesta enviada exitosamente");
      
      // Reload data to get updated proposal
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Proyecto no encontrado</p>
          <Link href="/dashboard/engineer">
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
              <span className="ml-4 text-gray-500">Detalle del Proyecto</span>
            </div>
            <Link href="/dashboard/engineer">
              <Button variant="outline" size="sm">
                ← Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Categoría: {project.category}</span>
                  {project.budget_estimate && (
                    <span>Presupuesto: ${project.budget_estimate.toLocaleString()}</span>
                  )}
                  {project.eta_days && (
                    <span>Tiempo estimado: {project.eta_days} días</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Descripción del Proyecto</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              </div>

              {project.location && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Ubicación</h2>
                  <p className="text-gray-700">{project.location}</p>
                </div>
              )}

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-3">Información del Cliente</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{project.client.full_name}</p>
                      {project.client.company && (
                        <p className="text-gray-600">{project.client.company}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Publicado: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">
                {existingProposal ? "Tu Propuesta" : "Enviar Propuesta"}
              </h2>

              {existingProposal && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Ya tienes una propuesta para este proyecto. Puedes actualizarla a continuación.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Estado: {existingProposal.status === "sent" ? "Enviada" : existingProposal.status}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Tu oferta (USD) *
                  </label>
                  <Input
                    id="bidAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label htmlFor="etaDays" className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo de entrega (días) *
                  </label>
                  <Input
                    id="etaDays"
                    type="number"
                    min="1"
                    max="365"
                    value={etaDays}
                    onChange={(e) => setEtaDays(e.target.value)}
                    required
                    placeholder="30"
                  />
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                    Detalles de tu propuesta
                  </label>
                  <Textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Explica cómo abordarás el proyecto, tu experiencia relevante, metodología, etc."
                    rows={4}
                  />
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

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting 
                    ? "Enviando..." 
                    : existingProposal 
                      ? "Actualizar Propuesta" 
                      : "Enviar Propuesta"
                  }
                </Button>
              </form>

              {project.budget_estimate && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    Presupuesto del cliente: ${project.budget_estimate.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Considera este rango al hacer tu oferta
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
