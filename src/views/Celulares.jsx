import Header from "../components/Header"
import { CheckCircle } from "lucide-react"
import { Building, Smartphone, Sparkles } from "lucide-react"
import UbicacionTienda from "../components/UbicacionTienda"

// Importamos las imágenes
import heroImage from "./../assets/1.png"
import Testimonios from "../components/Testimonios"

function App() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="pt-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="max-w-xl z-10 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                ¡Obtén un préstamo para estrenar celular hoy!
              </h1>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Construye tu historial crediticio</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Estrénalo ahora y paga después</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Compatible con las mejores marcas</span>
                </li>
              </ul>

              <button className="mt-5 bg-orange-500 text-white font-medium py-4 px-6 rounded-lg hover:bg-orange-600 transition transform hover:scale-105">
                Encuentra tu tienda más cercana
              </button>
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
        <h2 className="text-center text-5xl font-bold mb-10">
          El préstamo en el que confías
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 p-10 shadow-md shadow-blue-800 rounded-lg transition transform hover:scale-105">
            <div className="w-16 h-16 mb-3 rounded-full bg-orange-500 flex items-center justify-center">
              <Building color="white" size={30} />
            </div>

            <p className="font-bold text-2xl mb-3">Ve a tu tienda más cercana</p>

            <p>Solo lleva contigo:</p>

            <p>Numero de teléfono</p>
            <p>Identificación oficial</p>
          </div>

          <div className="bg-gray-100 p-10 shadow-md shadow-blue-800 rounded-lg transition transform hover:scale-105">
            <div className="w-16 h-16 mb-3 rounded-full bg-orange-500 flex items-center justify-center">
              <Smartphone color="white" size={30} />
            </div>

            <p className="font-bold text-2xl mb-3">Las mejores marcas</p>

            <p>Elige el modelo de tus sueños y aplica a un plan de financiamiento.</p>
          </div>

          <div className="bg-gray-100 p-10 shadow-md shadow-blue-800 rounded-lg transition transform hover:scale-105">
            <div className="w-16 h-16 mb-3 rounded-full bg-orange-500 flex items-center justify-center">
              <Sparkles color="white" size={30} />
            </div>

            <p className="font-bold text-2xl mb-3">Sin intereses moratorios</p>

            <p>Haz tus «paguitos» semanales a tiempo en cualquier tienda de conveniencia y construye tu historial crediticio.</p>
          </div>
        </div>
      </section>

      {/*Seccion de mapa */}
      <UbicacionTienda />


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

export default App

