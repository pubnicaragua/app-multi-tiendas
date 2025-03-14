"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Outlet } from "react-router-dom"
import NotificationBell from "../components/NotificationBell"
import supabase from "../utils/supabase"

function AdminLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(true)

    const tabs = [
        { name: "Mi Tienda", path: "/user/dashboard" },
        { name: "Resumen", path: "/user/resumen" },
        { name: "Pagos", path: "/user/pagos" },
        { name: "Reportes", path: "/user/reportes" },
    ]

    useEffect(() => {
        async function checkUserStore() {
            try {
                setLoading(true)

                // Verificar si hay un usuario autenticado
                const {
                    data: { user },
                    error: authError,
                } = await supabase.auth.getUser()

                console.log("Usuario autenticado:", user)

                if (authError || !user) {
                    console.log("Error de autenticación o usuario no encontrado:", authError)
                    // Si hay un error o no hay usuario, redirigir al login
                    navigate("/auth/login")
                    return
                }

                //Verificar si tiene asignada una tienda
                const { data: userStore, error: storeError } = await supabase
                    .from("user_store")
                    .select("store_id")
                    .eq("user_id", user.id)
                    .single()

                if (storeError) {
                    console.log("Error al obtener la tienda:", storeError)
                }

                if (!userStore) {
                    console.log("Usuario sin tienda asignada, redirigiendo a afiliación")
                    // Si no tiene rol, redirigir a la página de afiliación
                    navigate("/auth/register/affiliation/store")
                }
            } catch (error) {
                console.error("Error al verificar el rol del usuario:", error)
                navigate("/auth/login")
            } finally {
                setLoading(false)
            }
        }

        checkUserStore()
    }, [navigate])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 my-10">
                <div className="flex items-center justify-between mb-8 h-16">
                    <div className="flex items-center">
                        <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => navigate(-1)}>
                            <ChevronLeft className="h-6 w-6 text-gray-600" />
                        </button>

                        <div className="flex flex-col">
                            <h1 className="ml-4 text-4xl font-semibold text-gray-900">Panel de Usuario</h1>

                            <p className="ml-4 font-semibold text-gray-900">Bienvenido a tu panel de control</p>
                        </div>
                    </div>

                    <NotificationBell />
                </div>

                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300
                                ${location.pathname === tab.path
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            onClick={() => navigate(tab.path)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>

                <div className="py-6">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout

