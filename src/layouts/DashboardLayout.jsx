"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Outlet } from "react-router-dom"
import NotificationBell from "../components/NotificationBell"

function AdminLayout() {
    const navigate = useNavigate()
    const location = useLocation()

    const tabs = [
        { name: "Mi Tienda", path: "/user/dashboard" },
        { name: "Resumen", path: "/user/resumen" },
        { name: "Pagos", path: "/user/pagos" },
        { name: "Reportes", path: "/user/reportes" },
    ]

    return (
        <div className="bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 my-10">
                <div className="flex items-center justify-between mb-8 h-16">
                    <div className="flex items-center">
                        <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => navigate(-1)}>
                            <ChevronLeft className="h-6 w-6 text-gray-600" />
                        </button>

                        <div className="flex flex-col">
                            <h1 className="ml-4 text-4xl font-semibold text-gray-900">Panel de Administrador</h1>

                            <p className="ml-4 font-semibold text-gray-900">Sistema de Gestión Multi-tiendas</p>
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

