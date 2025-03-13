"use client"

import { useState } from "react"
import { Search, ChevronRight } from "lucide-react"

// Datos de tiendas en Ecuador
const stores = [
    {
        id: 1,
        name: "PayStore Quinindé Centro",
        address: "Av. Jimmy Anchico, Quinindé, Esmeraldas",
        coordinates: { lat: 0.3333, lng: -79.4667 },
    },
    {
        id: 2,
        name: "PayStore Quito Norte",
        address: "Av. 6 de Diciembre N34-74, Quito",
        coordinates: { lat: -0.1807, lng: -78.4678 },
    },
]

function StoreLocator() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredStores, setFilteredStores] = useState(stores)
    const [selectedStore, setSelectedStore] = useState(null)

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
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const mapUrl = selectedStore
        ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(selectedStore.name + " " + selectedStore.address)}`
        : `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=PayStore+Ecuador`;

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
                            placeholder="Ingresa una ubicación"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 focus:outline-none"
                        />
                        <button className="bg-blue-900 text-white px-6 py-3 hover:bg-blue-800 transition">
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {filteredStores.length > 0 && (
                    <p className="text-gray-600 mb-8 font-medium">
                        Mostrando <span className="text-green-600">{filteredStores.length}</span> resultados cerca de ti
                    </p>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Lista de tiendas */}
                    <div className="space-y-4">
                        {filteredStores.map((store) => (
                            <div
                                key={store.id}
                                className={`p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer ${selectedStore?.id === store.id ? "border-blue-500 shadow-lg" : ""}`}
                                onClick={() => handleStoreSelect(store)}
                            >
                                <h3 className="font-bold text-lg">{store.name}</h3>
                                <p className="text-gray-600">{store.address}</p>
                                <div className="flex justify-end">
                                    <button className="mt-2 flex items-center text-blue-600 hover:text-blue-800">
                                        Ver detalles <ChevronRight className="h-4 w-4 ml-1" />
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
            </div>
        </section>
    )
}

export default StoreLocator

