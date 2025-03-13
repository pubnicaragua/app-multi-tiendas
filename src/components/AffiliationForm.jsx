"use client"

import { useState } from "react"
import supabase from "../utils/supabase"

function AffiliationForm() {
    const initialFormState = {
        establishment_name: "",
        phone: "",
        city: "",
        address: "",
        postal_code: "",
        email: "",
        tipo_empresa: "Persona Física",
    }

    const [formData, setFormData] = useState(initialFormState)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.establishment_name) newErrors.establishment_name = "El nombre del negocio es requerido"
        if (!formData.address) newErrors.address = "La dirección es requerida"
        if (!formData.postal_code) newErrors.postal_code = "El código postal es requerido"
        if (!formData.city) newErrors.city = "La ciudad es requerida"
        if (!formData.phone) newErrors.phone = "El teléfono es requerido"
        if (!formData.email) {
            newErrors.email = "El correo electrónico es requerido"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            // Insertar tienda nueva
            const { data, error } = await supabase
                .from("store")
                .insert([
                    {
                        establishment_name: formData.establishment_name,
                        address: formData.address,
                        postal_code: formData.postal_code,
                        city: formData.city,
                        phone: formData.phone,
                        email: formData.email,
                        company_type: formData.tipo_empresa,
                        created_at: new Date(),
                    },
                ])
                .select()

            if (error) {
                console.error(error)
                alert("Hubo un error al registrar tu negocio: " + error.message)
                return
            }

            const storeId = data[0].id

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser()

            if (authError || !user) {
                console.error("Hubo un error al obtener al usuario: ", authError)
                alert("No se encontró un usuario autenticado.")
                return
            }

            // Insertar en user_store con ambos id
            const { error: userStoreError } = await supabase.from("user_store").insert([
                {
                    user_id: user.id,
                    store_id: storeId,
                    created_at: new Date(),
                },
            ])

            if (userStoreError) {
                console.error("Error al vincular usuario y tienda:", userStoreError)
                alert("Error al vincular usuario con tienda.")
            } else {
                alert("¡Tienda registrada y vinculada con éxito!")
                setFormData(initialFormState)
            }
        } catch (error) {
            console.error("Error inesperado:", error)
            alert("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-900 p-6">
                    <h2 className="text-2xl font-bold text-white">Registro de Negocio</h2>
                    <p className="text-blue-100 mt-2">Complete los datos de su establecimiento</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre del Negocio */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
                            <input
                                className={`w-full px-4 py-3 rounded-lg border ${errors.establishment_name ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                type="text"
                                name="establishment_name"
                                placeholder="Ej: Mi Tienda"
                                value={formData.establishment_name}
                                onChange={handleInputChange}
                            />
                            {errors.establishment_name && <p className="text-red-500 text-xs mt-1">{errors.establishment_name}</p>}
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                className={`w-full px-4 py-3 rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                type="text"
                                name="address"
                                placeholder="Ej: Av. Principal #123"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* Código Postal */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                            <input
                                className={`w-full px-4 py-3 rounded-lg border ${errors.postal_code ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                type="text"
                                name="postal_code"
                                placeholder="Ej: 12345"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                            />
                            {errors.postal_code && <p className="text-red-500 text-xs mt-1">{errors.postal_code}</p>}
                        </div>

                        {/* Ciudad */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                            <input
                                className={`w-full px-4 py-3 rounded-lg border ${errors.city ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                type="text"
                                name="city"
                                placeholder="Ej: Ciudad de México"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                type="email"
                                name="email"
                                placeholder="Ej: negocio@ejemplo.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input
                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                type="tel"
                                name="phone"
                                placeholder="Ej: 55 1234 5678"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    {/* Tipo de Empresa */}
                    <div className="mt-8">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Empresa</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                className={`flex-1 py-3 px-4 rounded-lg shadow-sm transition-colors ${formData.tipo_empresa === "Persona Física"
                                    ? "bg-blue-700 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    }`}
                                onClick={() => setFormData({ ...formData, tipo_empresa: "Persona Física" })}
                            >
                                Persona Física
                            </button>

                            <button
                                type="button"
                                className={`flex-1 py-3 px-4 rounded-lg shadow-sm transition-colors ${formData.tipo_empresa === "Persona Moral"
                                    ? "bg-blue-700 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    }`}
                                onClick={() => setFormData({ ...formData, tipo_empresa: "Persona Moral" })}
                            >
                                Persona Moral
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full sm:w-auto float-right py-3 px-8 rounded-lg text-white font-medium transition-colors ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Procesando...
                                </span>
                            ) : (
                                "Continuar →"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AffiliationForm

