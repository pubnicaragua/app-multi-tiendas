"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../utils/supabase"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

function UserDashboard() {
    const [userModules, setUserModules] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Obtener el usuario actual y sus módulos
        const fetchUserData = async () => {
            try {
                setLoading(true)

                // Obtener el usuario actual
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser()

                console.log(user)

                if (userError) throw userError
                if (!user) throw new Error("No se encontró un usuario autenticado")

                setUser(user)

                // Obtener los módulos y características seleccionados por el usuario
                const { data: selectedModules, error: modulesError } = await supabase
                    .from("selected_module_features")
                    .select(`
                        *,
                        store:store_id(
                            id,
                            establishment_name,
                            address,
                            city,
                            postal_code,
                            phone,
                            email,
                            company_type
                        ),
                        module:module_id(
                            id,
                            name,
                            
                            price
                        ),
                        feature:feature_id(
                            id,
                            name,
                            
                            price
                        )
                    `)
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })

                if (modulesError) throw modulesError

                // Agrupar por tienda y estado de confirmación
                const modulesByStore = selectedModules.reduce((acc, item) => {
                    if (!acc[item.store_id]) {
                        acc[item.store_id] = {
                            store: item.store,
                            modules: [],
                            features: [],
                            is_confirmed: item.is_confirmed,
                            created_at: item.created_at,
                        }
                    }

                    // Agregar módulo si no existe ya en el array
                    if (item.module && !acc[item.store_id].modules.find((m) => m.id === item.module.id)) {
                        acc[item.store_id].modules.push(item.module)
                    }

                    // Agregar característica si existe
                    if (item.feature) {
                        acc[item.store_id].features.push({
                            ...item.feature,
                            moduleId: item.module_id,
                        })
                    }

                    return acc
                }, {})

                setUserModules(Object.values(modulesByStore))
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    // Calcular el precio total de módulos y características
    const calculateTotal = (modules, features) => {
        const modulesTotal = modules.reduce((sum, module) => sum + module.price, 0)
        const featuresTotal = features.reduce((sum, feature) => sum + feature.price, 0)
        return modulesTotal + featuresTotal
    }

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
                {userModules.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-500">No tienes módulos configurados todavía.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {userModules.map((storeData) => (
                            <div key={storeData.store.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Cabecera con información de la tienda */}
                                <div className="p-6 border-b">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold">{storeData.store.establishment_name}</h2>
                                            <p className="text-sm text-gray-500">
                                                {storeData.store.address}, {storeData.store.city}
                                            </p>
                                        </div>

                                        {/* Estado de la solicitud */}
                                        {storeData.is_confirmed ? (
                                            <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Confirmado
                                            </div>
                                        ) : (
                                            <div className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Pendiente
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mensaje según el estado de confirmación */}
                                {storeData.is_confirmed ? (
                                    <div className="bg-green-50 p-4 border-b border-green-100">
                                        <div className="flex items-center hover:cursor-pointer">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 " />
                                            <a
                                                className="text-green-700"
                                                onClick={() => navigate(`/checkout/${storeData.store.id}`)}
                                            >Tus módulos han sido confirmados, puedes proceder a pagar</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 p-4 border-b border-blue-100">
                                        <div className="flex items-center">
                                            <Clock className="w-5 h-5 text-blue-500 mr-2" />
                                            <p className="text-blue-700">Espera mientras el administrador confirma tu solicitud</p>
                                        </div>
                                    </div>
                                )}

                                {/* Contenido principal */}
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Módulos */}
                                        <div>
                                            <h3 className="font-medium mb-4">Módulos seleccionados</h3>
                                            <div className="space-y-3">
                                                {storeData.modules.map((module) => (
                                                    <div key={module.id} className="flex justify-between p-3 bg-gray-50 rounded-md">
                                                        <span>{module.name}</span>
                                                        <span className="font-medium">${module.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Características */}
                                        <div>
                                            <h3 className="font-medium mb-4">Características adicionales</h3>
                                            <div className="space-y-3">
                                                {storeData.features.length > 0 ? (
                                                    storeData.features.map((feature) => (
                                                        <div key={feature.id} className="flex justify-between p-3 bg-gray-50 rounded-md">
                                                            <span>{feature.name}</span>
                                                            <span className="font-medium">${feature.price}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No hay características adicionales seleccionadas</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="mt-6 pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold">Total:</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                ${calculateTotal(storeData.modules, storeData.features)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserDashboard

