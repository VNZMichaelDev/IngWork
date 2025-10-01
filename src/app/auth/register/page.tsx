"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { UserRole } from "@/lib/types";

type Props = { searchParams: Promise<{ role?: string }> };

export default function RegisterPage({ searchParams }: Props) {
  const params = use(searchParams);
  const initialRole = (params?.role ?? "") as UserRole | "";
  const [role, setRole] = useState<UserRole | "">(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!role) {
      setError("Por favor selecciona un rol");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp(email, password, role);
      
      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Create profile immediately
        const { error: profileError } = await authClient.createProfile({
          id: data.user.id,
          role,
          full_name: fullName,
          email: email,
        });

        if (profileError) {
          setError("Error creando perfil: " + profileError.message);
          return;
        }

        // Redirect to login after successful registration
        router.push("/auth/login");
      }
    } catch {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <main className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a ConstruMatch</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona tu rol
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`p-3 rounded border text-sm font-medium transition ${
                  role === "client"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                Cliente
              </button>
              <button
                type="button"
                onClick={() => setRole("engineer")}
                className={`p-3 rounded border text-sm font-medium transition ${
                  role === "engineer"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                Ingeniero
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
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
              Correo electrónico
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">¿Ya tienes cuenta? </span>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
