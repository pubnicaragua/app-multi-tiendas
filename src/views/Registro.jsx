import { useState } from "react"
import { supabase } from "../utils/supabase"
import { Link } from "react-router-dom"

const Registro = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación simple
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.")
      return
    }

    setError("")
    setSuccessMessage("") // Limpiar cualquier mensaje de éxito previo

    try {
      // Registrar al usuario con Supabase
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      // Verificar si hay un error en el registro
      if (signupError) {
        console.error("Error al registrar el usuario:", signupError)
        setError(signupError.message)
        return
      }

      // Obtener el ID del usuario recién registrado
      const userId = data.user.id

      // Asignar el rol_id 2 (usuario normal) al usuario
      const { error: roleError } = await supabase.from("user_roles").insert([{ user_id: userId, role_id: 2 }])

      if (roleError) {
        console.error("Error al asignar rol al usuario:", roleError)
        // No mostramos este error al usuario para no confundirlo
        // El usuario ya se registró correctamente
      }

      // Mensaje de éxito
      setSuccessMessage("¡Registro exitoso! Por favor, verifica tu correo electrónico.")
    } catch (error) {
      console.error("Error en el proceso de registro:", error) // Mostrar el error completo en consola
      setError("Hubo un problema al registrar el usuario.")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Registrarse
            </button>
            <Link
              to="/login"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              ¿Ya tienes una cuenta?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Registro

