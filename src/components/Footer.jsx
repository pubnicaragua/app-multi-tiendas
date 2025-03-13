function Footer() {

    return (
        <div>
            <section className="relative bg-gradient-to-b from-white to-blue-50 overflow-hidden">
                {/* Ondas decorativas */}
                <div className="absolute inset-0 z-0">
                    <svg
                        className="absolute bottom-0 w-full h-48 text-blue-50"
                        viewBox="0 0 1440 320"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="currentColor"
                            fillOpacity="1"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Contenido */}
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <h2 className="text-4xl font-bold mb-4">¿Quieres saber más?</h2>
                            <h3 className="text-3xl font-bold mb-8">¡Contáctanos!</h3>
                            <button className="bg-emerald-500 text-white font-medium py-3 px-8 rounded-lg hover:bg-emerald-600 transition transform hover:scale-105">
                                Contáctanos
                            </button>
                        </div>

                        {/* Imágenes decorativas */}
                        <div className="lg:w-1/2 relative">
                            {/* Círculos decorativos */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-64 h-64 bg-emerald-200 rounded-full opacity-50"></div>
                            </div>
                            <div className="absolute top-0 right-0">
                                <div className="w-32 h-32 bg-emerald-300 rounded-full opacity-30"></div>
                            </div>
                            <div className="absolute bottom-0 left-0">
                                <div className="w-24 h-24 bg-emerald-100 rounded-full opacity-40"></div>
                            </div>

                            {/* Imágenes circulares */}
                            <div className="relative flex justify-center">
                                <div className="w-48 h-48 rounded-full overflow-hidden bg-white shadow-lg z-20 -mr-8">
                                    <img src="/service-1.jpg" alt="Servicio al cliente" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-48 h-48 rounded-full overflow-hidden bg-white shadow-lg z-10">
                                    <img src="/service-3.jpg" alt="Cliente satisfecho" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Círculos decorativos adicionales */}
                <div className="absolute top-1/4 left-0 w-16 h-16 bg-emerald-100 rounded-full opacity-30"></div>
                <div className="absolute bottom-1/4 right-0 w-20 h-20 bg-emerald-200 rounded-full opacity-40"></div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Sobre PayStore</h4>
                            <p className="text-gray-600">
                                Ofrecemos soluciones de crédito rápidas y accesibles para que puedas obtener el celular que deseas o el
                                préstamo que necesitas.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-blue-900">
                                        Celulares
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-900">
                                        Préstamos
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-900">
                                        Vende con nosotros
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-900">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>info@paystore.com</li>
                                <li>+1 (800) 123-4567</li>
                                <li>Calle Principal #123, Ciudad</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-600 hover:text-blue-900">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-blue-900">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.82 7.6c.004.1.007.198.007.298 0 3.045-2.318 6.56-6.56 6.56a6.529 6.529 0 01-3.532-1.033 4.618 4.618 0 003.407-.954 2.304 2.304 0 01-2.15-1.6 2.292 2.292 0 001.04-.04 2.303 2.303 0 01-1.846-2.255v-.03c.31.173.666.277 1.044.29a2.302 2.302 0 01-.713-3.07 6.54 6.54 0 004.749 2.407 2.302 2.302 0 013.926-2.1 4.601 4.601 0 001.463-.559 2.31 2.31 0 01-1.012 1.275 4.588 4.588 0 001.324-.363 4.66 4.66 0 01-1.147 1.19z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-blue-900">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2 15.5v-9l6 4.5-6 4.5z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
                        <p>© {new Date().getFullYear()} PayStore. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer