"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../utils/supabase"
import { Store, Package, AlertCircle, ArrowRight } from "lucide-react"

function StoreDashboard() {
    const [userStores, setUserStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Obtener el usuario actual y sus tiendas
        const fetchUserStores = async () => {
            try {
                setLoading(true)

                // Obtener el usuario actual
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser()

                if (userError) throw userError
                if (!user) throw new Error("No se encontró un usuario autenticado")

                // Obtener las tiendas del usuario
                const { data: userStoreData, error: storeError } = await supabase
                    .from("user_store")
                    .select(`
                        store_id,
                        store:store_id(
                            id,
                            establishment_name,
                            address,
                            city,
                            postal_code,
                            phone,
                            email,
                            company_type
                        )
                    `)
                    .eq("user_id", user.id)

                if (storeError) throw storeError

                // Filtrar tiendas nulas y formatear datos
                const stores = userStoreData.filter((item) => item.store !== null).map((item) => item.store)

                setUserStores(stores)
            } catch (error) {
                console.error("Error al obtener tiendas del usuario:", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUserStores()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-center mb-2">Error</h2>
                    <p className="text-gray-600 text-center">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Mis Tiendas</h1>

                {userStores.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-500">No tienes tiendas configuradas todavía.</p>
                        <button
                            onClick={() => navigate("/auth/register/affiliation/store")}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Registrar una tienda
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {userStores.map((store) => (
                            <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Cabecera con información de la tienda */}
                                <div className="p-6 border-b">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <Store className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{store.establishment_name}</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {store.address}, {store.city}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {store.postal_code} • {store.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Información adicional */}
                                <div className="p-4 bg-gray-50">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Correo:</span> {store.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Tipo de empresa:</span> {store.company_type}
                                    </p>
                                </div>

                                {/* Botones de acción */}
                                <div className="p-4 flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate(`/manage/store/${store.id}`)}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <Store className="h-4 w-4" />
                                        <span>Administrar</span>
                                        <ArrowRight className="h-4 w-4 ml-auto" />
                                    </button>

                                    <button
                                        onClick={() => navigate(`/manage/modules/${store.id}`)}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <Package className="h-4 w-4" />
                                        <span>Adquirir más módulos</span>
                                        <ArrowRight className="h-4 w-4 ml-auto" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StoreDashboard

