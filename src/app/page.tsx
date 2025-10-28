import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image 
                src="/ingwork logo.png" 
                alt="ConstruMatch Logo" 
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-gray-900">ConstruMatch</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#problema" className="text-gray-600 hover:text-gray-900 transition-colors">El Problema</a>
              <a href="#solucion" className="text-gray-600 hover:text-gray-900 transition-colors">Nuestra Solución</a>
              <a href="#caracteristicas" className="text-gray-600 hover:text-gray-900 transition-colors">Características</a>
              <a href="#unete" className="text-gray-600 hover:text-gray-900 transition-colors">Únete</a>
              <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Iniciar Sesión</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              🚀 La plataforma líder en construcción
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Conectando Talento y Oportunidades<br />en <span className="text-blue-600">Construcción</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra profesionales confiables o tu próximo proyecto con ConstruMatch.
              La plataforma que conecta clientes con expertos en construcción.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                href="#unete"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Únete a ConstruMatch →
              </a>
              <a
                href="#solucion"
                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-gray-200 hover:border-blue-300"
              >
                Descubre cómo funciona
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600 mt-1">Profesionales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600 mt-1">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600 mt-1">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El Problema Section */}
      <section id="problema" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            El Desafío Actual en Construcción
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Clientes</h3>
              <p className="text-gray-600">
                Dificultad para encontrar profesionales confiables, con experiencia verificada y disponibilidad inmediata para sus proyectos de construcción.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Para Profesionales</h3>
              <p className="text-gray-600">
                Falta de oportunidades constantes, dificultad para conseguir nuevos clientes y escasa visibilidad profesional en el mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Solución Section */}
      <section id="solucion" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Solución: ConstruMatch
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Una plataforma digital que conecta clientes con profesionales de la construcción de manera confiable, con sistema de calificaciones y gestión de proyectos integrada.
            </p>
          </div>
        </div>
      </section>

      {/* Características Section */}
      <section id="caracteristicas" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Características del Servicio
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fácil de Usar</h3>
              <p className="text-gray-600">
                Interfaz intuitiva para publicar proyectos y enviar propuestas en minutos.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Seguro y Confiable</h3>
              <p className="text-gray-600">
                Sistema de calificaciones y reseñas para garantizar la calidad del servicio.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comunicación Directa</h3>
              <p className="text-gray-600">
                Mensajería integrada para coordinar todos los detalles del proyecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Únete Section */}
      <section id="unete" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            Únete a la Revolución de la Construcción
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Selecciona tu perfil para comenzar y sé parte del futuro del sector.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a
              href="/auth/register?role=client"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-8 hover:shadow-xl hover:border-blue-400 transition-all duration-300 text-center transform hover:-translate-y-2"
            >
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Soy Cliente</h3>
              <p className="text-gray-700 mb-6">
                Publica tu proyecto de construcción y recibe propuestas de profesionales especializados.
              </p>
              <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold group-hover:bg-blue-700 transition-colors">
                Comenzar como Cliente
              </span>
            </a>
            <a
              href="/auth/register?role=engineer"
              className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-8 hover:shadow-xl hover:border-green-400 transition-all duration-300 text-center transform hover:-translate-y-2"
            >
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Soy Profesional</h3>
              <p className="text-gray-700 mb-6">
                Encuentra proyectos según tu especialidad y envía propuestas competitivas.
              </p>
              <span className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold group-hover:bg-green-700 transition-colors">
                Comenzar como Profesional
              </span>
            </a>
          </div>
          <div className="text-center mt-8">
            <a 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image 
                  src="/ingwork logo.png" 
                  alt="ConstruMatch Logo" 
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-lg font-bold">ConstruMatch</span>
              </div>
              <p className="text-gray-400 text-sm">
                Conectando talento y oportunidades en el sector de la construcción.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#problema" className="hover:text-white transition-colors">El Problema</a></li>
                <li><a href="#solucion" className="hover:text-white transition-colors">Nuestra Solución</a></li>
                <li><a href="#caracteristicas" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#unete" className="hover:text-white transition-colors">Únete</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 ConstruMatch. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
