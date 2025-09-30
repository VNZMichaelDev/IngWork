import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Mobile-first responsive container */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 sm:space-y-8 lg:space-y-12">
          
          {/* Logo and Title - Responsive sizing */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-8">
            <Image 
              src="/ingwork logo.png" 
              alt="IngWork Logo" 
              width={48}
              height={48}
              className="object-contain sm:w-16 sm:h-16 lg:w-20 lg:h-20"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900">
              IngWork
            </h1>
          </div>

          {/* Description - Responsive text */}
          <div className="max-w-2xl lg:max-w-4xl">
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
              Conecta Clientes con Ingenieros. Crea proyectos, recibe propuestas, negocia y gestiona el trabajo en un solo lugar.
            </p>
          </div>

          {/* Role Selection Cards - Fully responsive grid */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            <a
              href="/auth/register?role=client"
              className="group bg-white rounded-xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300 text-left transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Soy Cliente</h2>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Publica un proyecto y recibe propuestas de ingenieros profesionales especializados.
              </p>
            </a>

            <a
              href="/auth/register?role=engineer"
              className="group bg-white rounded-xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-green-300 transition-all duration-300 text-left transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Soy Ingeniero</h2>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Encuentra proyectos según tu especialidad y envía propuestas competitivas.
              </p>
            </a>
          </div>

          {/* Login Link - Responsive spacing */}
          <div className="pt-4 sm:pt-6">
            <a 
              href="/auth/login" 
              className="text-sm sm:text-base text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>

          {/* Features Preview - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:block w-full max-w-6xl mt-16">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Fácil de usar</h3>
                <p className="text-sm text-gray-600">Interfaz intuitiva para clientes e ingenieros</p>
              </div>
              <div className="space-y-3">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Seguro</h3>
                <p className="text-sm text-gray-600">Plataforma confiable para tus proyectos</p>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Rápido</h3>
                <p className="text-sm text-gray-600">Conecta con profesionales al instante</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
