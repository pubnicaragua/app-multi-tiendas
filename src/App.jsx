"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "./utils/supabase"

function App() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkUserRole() {
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

        // Buscar el rol del usuario en la tabla user_roles
        const { data: userRole, error: roleError } = await supabase
          .from("user_roles")
          .select("role_id")
          .eq("user_id", user.id)
          .single()

        console.log("Rol del usuario:", userRole, "Error:", roleError)

        if (roleError) {
          console.log("Error al obtener el rol:", roleError)
        }

        if (!userRole) {
          console.log("Usuario sin rol asignado, redirigiendo a afiliación")
          // Si no tiene rol, redirigir a la página de afiliación
          navigate("/auth/register/affiliation/store")
          return
        }

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

        // Redirigir según el rol
        if (userRole.role_id === 1) {
          console.log("Redirigiendo a panel de administrador")
          // Rol de administrador
          navigate("/admin")
        } else if (userRole.role_id === 2) {
          console.log("Redirigiendo a dashboard de usuario")
          // Rol de usuario normal
          navigate("/user/dashboard")
        } else {
          console.log("Rol desconocido:", userRole.role_id)
          // Cualquier otro rol no definido
          navigate("/auth/register/affiliation/store")
        }
      } catch (error) {
        console.error("Error al verificar el rol del usuario:", error)
        navigate("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkUserRole()
  }, [navigate])

  // Mostrar spinner mientras se carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Este return normalmente no se mostrará porque habrá una redirección
  return <div className="flex items-center justify-center min-h-screen bg-gray-100">Redirigiendo...</div>
}

export default App

