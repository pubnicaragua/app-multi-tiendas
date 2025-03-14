"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"
import NotificationBell from "../components/NotificationBell"
import UserProfileMenu from "../components/UserProfileMenu"

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { name: "Resumen", path: "/admin/manage/resume" },
    { name: "Tiendas", path: "/admin/manage/stores" },
    { name: "Solicitudes", path: "/admin/manage/requests" },
    { name: "Reportes", path: "/admin/manage/reports" },
  ]

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 my-10">
        <div className="flex items-center justify-between mb-8 h-16">
          <div className="flex items-center">
            <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => navigate("/admin")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 bg-indigo-200 rounded-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex flex-col">
              <h1 className="ml-4 text-4xl font-semibold text-gray-900">Panel de Administrador</h1>
              <p className="ml-4 font-semibold text-gray-900">Sistema de Gestión Multi-tiendas</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <UserProfileMenu />
          </div>
        </div>

        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300
                                ${
                                  location.pathname === tab.path
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

