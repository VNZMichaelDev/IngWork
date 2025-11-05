"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Engineer {
  id: string;
  full_name: string;
  specialty: string;
  experience_years: number;
  hourly_rate: number;
  company: string;
  portfolio_url: string;
  availability: string;
  avatar_url: string;
}

const specialties = [
  "Desarrollo Web",
  "Desarrollo Móvil",
  "Diseño UI/UX",
  "Ingeniería Civil",
  "Ingeniería Mecánica",
  "Ingeniería Eléctrica",
  "Arquitectura",
  "Consultoría",
  "Marketing Digital",
  "Otro"
];

export default function EngineersSearchPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [filteredEngineers, setFilteredEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEngineers();
  }, [engineers, searchTerm, selectedSpecialty, minRate, maxRate, minExperience, availabilityFilter]);

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

      // Load engineers
      const { data: engineersData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "engineer")
        .not("specialty", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading engineers:", error);
      } else {
        setEngineers(engineersData || []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterEngineers = () => {
    let filtered = engineers;

    // Search by name or specialty
    if (searchTerm) {
      filtered = filtered.filter(engineer =>
        engineer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engineer.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engineer.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter(engineer => engineer.specialty === selectedSpecialty);
    }

    // Filter by hourly rate range
    if (minRate) {
      filtered = filtered.filter(engineer => 
        engineer.hourly_rate && engineer.hourly_rate >= parseFloat(minRate)
      );
    }
    if (maxRate) {
      filtered = filtered.filter(engineer => 
        engineer.hourly_rate && engineer.hourly_rate <= parseFloat(maxRate)
      );
    }

    // Filter by experience
    if (minExperience) {
      filtered = filtered.filter(engineer => 
        engineer.experience_years && engineer.experience_years >= parseInt(minExperience)
      );
    }

    // Filter by availability
    if (availabilityFilter) {
      filtered = filtered.filter(engineer => engineer.availability === availabilityFilter);
    }

    setFilteredEngineers(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    setMinRate("");
    setMaxRate("");
    setMinExperience("");
    setAvailabilityFilter("");
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Disponible";
      case "busy":
        return "Ocupado";
      case "unavailable":
        return "No disponible";
      default:
        return "No especificado";
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
              <span className="ml-4 text-gray-500">Buscar Profesionales</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpiar
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar
                  </label>
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre, especialidad, empresa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Todas las especialidades</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarifa por hora (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={minRate}
                      onChange={(e) => setMinRate(e.target.value)}
                      placeholder="Mín"
                      min="0"
                    />
                    <Input
                      type="number"
                      value={maxRate}
                      onChange={(e) => setMaxRate(e.target.value)}
                      placeholder="Máx"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experiencia mínima (años)
                  </label>
                  <Input
                    type="number"
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidad
                  </label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Cualquier disponibilidad</option>
                    <option value="available">Disponible</option>
                    <option value="busy">Ocupado</option>
                    <option value="unavailable">No disponible</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Engineers List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Ingenieros Disponibles
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredEngineers.length} de {engineers.length} ingenieros
              </p>
            </div>

            {filteredEngineers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron ingenieros
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros para ver más resultados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEngineers.map((engineer) => (
                  <div key={engineer.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{engineer.full_name}</h3>
                            <p className="text-gray-600">{engineer.specialty}</p>
                            {engineer.company && (
                              <p className="text-sm text-gray-500">{engineer.company}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(engineer.availability)}`}>
                            {getAvailabilityText(engineer.availability)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Experiencia</p>
                            <p className="font-semibold">
                              {engineer.experience_years ? `${engineer.experience_years} años` : "No especificada"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Carnet de colegiatura</p>
                            <p className="font-semibold">
                              {engineer.hourly_rate ? engineer.hourly_rate : "No especificado"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Especialidad</p>
                            <p className="font-semibold text-sm">{engineer.specialty}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Estado</p>
                            <p className="font-semibold text-sm">{getAvailabilityText(engineer.availability)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {engineer.portfolio_url && (
                            <a
                              href={engineer.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Ver portafolio →
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button size="sm">
                          Contactar
                        </Button>
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
