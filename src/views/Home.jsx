import Header from "../components/Header"
import { CheckCircle } from "lucide-react"

// Importamos las imágenes
import heroImage from "../assets/1.png"
import featureImage from "../assets/3.png"
import Footer from "../components/Footer"
import Testimonios from "../components/Testimonios"

function Home() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="pt-20 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="max-w-xl z-10 text-center lg:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                La plataforma todo en uno para <span className="text-indigo-600">tiendas</span>,{" "}
                                <span className="text-indigo-600">créditos </span> y <span className="text-indigo-600">administración</span>
                            </h1>
                            <p className="text-xl text-gray-600 mt-4">Gestiona tu tienda y otorga créditos con facilidad</p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button className="bg-blue-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-950 transition transform hover:scale-105">
                                    Explora tiendas y créditos
                                </button>
                                <button className="bg-orange-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-orange-600 transition transform hover:scale-105">
                                    Descubre cómo otorgar créditos
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <img
                                src={heroImage || "/placeholder.svg"}
                                alt="Persona usando celular"
                                className="rounded-lg w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-bold">
                                Gestiona tu <span className="text-indigo-600">tienda</span> y créditos fácilmente
                            </h2>
                            <p className="text-lg text-gray-600 mt-4">
                                Administra tu inventario, clientes y financiamientos desde una sola plataforma. Optimiza tu negocio con herramientas avanzadas.
                            </p>
                            <ul className="mt-6 space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Otorga y gestiona créditos con facilidad</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Control total sobre inventario y ventas</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Encuentra tiendas que ofrecen financiamiento</span>
                                </li>
                            </ul>
                            <button className="mt-8 bg-blue-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-950 transition transform hover:scale-105">
                                Descubre cómo funciona
                            </button>
                        </div>

                        <div className="lg:w-1/2">
                            <img
                                src={featureImage || "/placeholder.svg"}
                                alt="Interfaz de software de gestión"
                                className="rounded-lg w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>


            {/* Brands Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-2xl font-medium text-center text-gray-500 mb-12">Marcas compatibles con PayStore</h3>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        <img src="/huawei.jpeg" alt="Huawei" className="h-20 object-contain" />
                        <img src="/samsung.jpeg" alt="Samsung" className="h-20 object-contain" />
                        <img src="/xiaomi.jpeg" alt="Xiaomi" className="h-20 object-contain" />
                        <img src="/iphone.jpeg" alt="iPhone" className="h-20 object-contain" />
                        <img src="/nokia.jpeg" alt="Nokia" className="h-20 object-contain" />
                        <img src="/oneplus.jpeg" alt="OnePlus" className="h-20 object-contain" />
                        <img src="/infinix.jpeg" alt="Infinix" className="h-20 object-contain" />
                        <img src="/vite.svg" alt="Vite" className="h-20 object-contain" />
                    </div>
                </div>
            </section>

            <Testimonios />

        </div>
    )
}

export default Home

