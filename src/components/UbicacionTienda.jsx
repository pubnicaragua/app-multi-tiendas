"use client"

import { useState, useEffect } from "react"
import { Search, ChevronRight, MapPin } from "lucide-react"
import supabase from "../utils/supabase"

function StoreLocator() {
    const [searchQuery, setSearchQuery] = useState("")
    const [stores, setStores] = useState([])
    const [filteredStores, setFilteredStores] = useState([])
    const [selectedStore, setSelectedStore] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Cargar tiendas desde Supabase
    useEffect(() => {
        async function fetchStores() {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from("store")
                    .select("id, establishment_name, address, city, phone, long, lat")
                    .eq("is_active", true)

                if (error) throw error

                // Transformar los datos al formato que espera el componente
                const formattedStores = data.map((store) => ({
                    id: store.id,
                    name: store.establishment_name,
                    address: `${store.address}, ${store.city}`,
                    phone: store.phone,
                    coordinates: { lat: store.lat, lng: store.long },
                }))

                setStores(formattedStores)
                setFilteredStores(formattedStores)
            } catch (err) {
                console.error("Error al cargar tiendas:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStores()
    }, [])

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        if (query.trim() === "") {
            setFilteredStores(stores)
            return
        }

        const filtered = stores.filter(
            (store) => store.name.toLowerCase().includes(query) || store.address.toLowerCase().includes(query),
        )
        setFilteredStores(filtered)
    }

    const handleStoreSelect = (store) => {
        setSelectedStore(store)
    }

    // Construir la URL del mapa basada en la tienda seleccionada o mostrar todas
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    // Si hay una tienda seleccionada, usar sus coordenadas exactas
    const mapUrl = selectedStore
        ? `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}&zoom=16&maptype=roadmap`
        : filteredStores.length > 0
            ? `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=PayStore+Managua`
            : `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=0,-78&zoom=6&maptype=roadmap`

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center mb-12">Encuentra tu tienda más cercana</h2>

                {/* Buscador */}
                <div className="relative max-w-2xl mx-auto mb-8">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <Search className="ml-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ciudad o nombre de tienda"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 focus:outline-none"
                        />
                        <button className="bg-blue-900 text-white px-6 py-3 hover:bg-blue-800 transition">
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">Error al cargar tiendas: {error}</p>
                    </div>
                ) : (
                    <>
                        {filteredStores.length > 0 && (
                            <p className="text-gray-600 mb-8 font-medium">
                                Mostrando <span className="text-green-600">{filteredStores.length}</span> resultados
                            </p>
                        )}

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Lista de tiendas */}
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {filteredStores.map((store) => (
                                    <div
                                        key={store.id}
                                        className={`p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer ${selectedStore?.id === store.id ? "border-blue-500 shadow-lg" : ""}`}
                                        onClick={() => handleStoreSelect(store)}
                                    >
                                        <h3 className="font-bold text-lg">{store.name}</h3>
                                        <p className="text-gray-600">{store.address}</p>
                                        {store.phone && <p className="text-gray-600">Tel: {store.phone}</p>}
                                        <div className="flex justify-end">
                                            <button className="mt-2 flex items-center text-blue-600 hover:text-blue-800">
                                                Ver en mapa <MapPin className="h-4 w-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {filteredStores.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No se encontraron tiendas con esa ubicación</p>
                                    </div>
                                )}
                            </div>

                            {/* Mapa */}
                            <div className="h-[500px] rounded-lg overflow-hidden border shadow-lg">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={mapUrl}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default StoreLocator

