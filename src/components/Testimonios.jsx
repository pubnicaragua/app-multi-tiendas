function Testimonios() {

    return (
        <div>
            {/* Testimonios Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-green-700 mb-8">
                            Millones de clientes en todo el mundo están comprando sus celulares de manera rápida y fácil.
                        </h2>
                        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
                            <p className="text-xl text-gray-600 italic mb-4">
                                "Tiene una amplia facilidad de pagos y son super pequeñitos."
                            </p>
                            <p className="text-gray-500 font-medium">Katherin, México</p>
                        </div>

                        {/* Círculos de testimonios */}
                        <div className="flex justify-center gap-8 mb-20">
                            <div className="w-24 h-24 rounded-full bg-orange-100 overflow-hidden">
                                <img src="/5.jpg" alt="Usuario testimonio" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-24 h-24 rounded-full bg-orange-100 overflow-hidden">
                                <img src="/6.jpg" alt="Usuario testimonio" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-24 h-24 rounded-full bg-orange-100 overflow-hidden">
                                <img src="/7.jpg" alt="Usuario testimonio" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Sección de video */}
                        <h3 className="text-3xl font-bold mb-8">Preguntamos a nuestros usuarios ¿Qué piensan de PayStore?</h3>
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                            <video className="w-full h-full object-cover" controls poster="/video-thumbnail.jpg">
                                <source src="https://cdn.pixabay.com/video/2023/03/15/154830-808562567_large.mp4" type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Testimonios