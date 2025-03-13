"use client"

import { useState, useEffect } from "react"
import supabase from "../utils/supabase"
import { Check, X } from "lucide-react"

function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSolicitudes()
    }, [])

    const fetchSolicitudes = async () => {
        try {
            // Obtener solicitudes no confirmadas junto con la información de la tienda
            const { data: selectedModules, error: modulesError } = await supabase
                .from("selected_module_features")
                .select(`
                    *,
                    store:store_id(
                        id,
                        establishment_name,
                        address,
                        city,
                        phone,
                        email
                    ),
                    module:module_id(
                        name,
                        price
                    ),
                    feature:feature_id(
                        name,
                        price
                    )
                `)
                .eq("isConfirmed", false)
                .order("created_at", { ascending: false })

            if (modulesError) throw modulesError

            // Agrupar por tienda
            const solicitudesPorTienda = selectedModules.reduce((acc, curr) => {
                if (!acc[curr.store_id]) {
                    acc[curr.store_id] = {
                        store: curr.store,
                        modules: [],
                        features: [],
                        created_at: curr.created_at,
                    }
                }
                if (curr.module && !acc[curr.store_id].modules.find((m) => m.id === curr.module_id)) {
                    acc[curr.store_id].modules.push(curr.module)
                }
                if (curr.feature) {
                    acc[curr.store_id].features.push(curr.feature)
                }
                return acc
            }, {})

            setSolicitudes(Object.values(solicitudesPorTienda))
        } catch (error) {
            console.error("Error al obtener solicitudes:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmation = async (storeId, isApproved) => {
        try {
            setLoading(true)

            // Actualizar el estado de confirmación
            const { error: updateError } = await supabase
                .from("selected_module_features")
                .update({ isConfirmed: true })
                .eq("store_id", storeId)

            if (updateError) throw updateError

            // Crear notificación
            const message = isApproved
                ? "Tu solicitud de módulos ha sido aprobada"
                : "Tu solicitud de módulos ha sido rechazada"

            const { error: notificationError } = await supabase.from("notifications").insert([
                {
                    message,
                    is_read: false,
                    created_at: new Date(),
                },
            ])

            if (notificationError) throw notificationError

            // Actualizar la lista de solicitudes
            await fetchSolicitudes()
        } catch (error) {
            console.error("Error al procesar la solicitud:", error)
            alert("Error al procesar la solicitud")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Solicitudes pendientes</h1>

            <div className="space-y-6">
                {solicitudes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay solicitudes pendientes</p>
                ) : (
                    solicitudes.map((solicitud) => (
                        <div key={solicitud.store.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">{solicitud.store.establishment_name}</h2>
                                    <div className="text-sm text-gray-500">{new Date(solicitud.created_at).toLocaleString()}</div>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pendiente</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2">Información de contacto</h3>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium">Dirección:</span> {solicitud.store.address}
                                        </p>
                                        <p>
                                            <span className="font-medium">Ciudad:</span> {solicitud.store.city}
                                        </p>
                                        <p>
                                            <span className="font-medium">Teléfono:</span> {solicitud.store.phone}
                                        </p>
                                        <p>
                                            <span className="font-medium">Email:</span> {solicitud.store.email}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Módulos seleccionados</h3>
                                    <div className="space-y-2">
                                        {solicitud.modules.map((module) => (
                                            <div key={module.id} className="flex justify-between text-sm">
                                                <span>{module.name}</span>
                                                <span className="font-medium">${module.price}</span>
                                            </div>
                                        ))}
                                        <div className="pt-2 mt-2 border-t">
                                            <div className="flex justify-between font-medium">
                                                <span>Total Módulos:</span>
                                                <span>${solicitud.modules.reduce((sum, module) => sum + module.price, 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={() => handleConfirmation(solicitud.store.id, false)}
                                    className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                                    disabled={loading}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Rechazar
                                </button>
                                <button
                                    onClick={() => handleConfirmation(solicitud.store.id, true)}
                                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    disabled={loading}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Aprobar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Solicitudes

