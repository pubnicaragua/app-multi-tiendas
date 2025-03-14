"use client"

import { Construction, Hammer, HardHat, Wrench } from "lucide-react"
import { useState, useEffect } from "react"

const icons = [Construction, Hammer, HardHat, Wrench]

function ModuloEnConstruccion({
    titulo = "Módulo en Construcción",
    mensaje = "Estamos trabajando para implementar esta funcionalidad pronto.",
    icono = "random",
    className = "",
}) {
    const [IconComponent, setIconComponent] = useState(Construction)

    useEffect(() => {
        // Si se especifica un icono aleatorio, seleccionar uno al azar
        if (icono === "random") {
            const randomIndex = Math.floor(Math.random() * icons.length)
            setIconComponent(icons[randomIndex])
        } else if (icono === "construction") {
            setIconComponent(Construction)
        } else if (icono === "hammer") {
            setIconComponent(Hammer)
        } else if (icono === "hardhat") {
            setIconComponent(HardHat)
        } else if (icono === "wrench") {
            setIconComponent(Wrench)
        }
    }, [icono])

    return (
        <div className={`flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md ${className}`}>
            <div className="relative">
                <div className="absolute -inset-1 bg-yellow-400 rounded-full opacity-70 animate-pulse"></div>
                <div className="relative bg-yellow-100 p-6 rounded-full">
                    <IconComponent className="h-12 w-12 text-yellow-600" />
                </div>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-800">{titulo}</h2>

            <p className="mt-3 text-center text-gray-600 max-w-md">{mensaje}</p>

            <div className="mt-6 flex items-center space-x-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
                <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
            </div>
        </div>
    )
}

export default ModuloEnConstruccion

