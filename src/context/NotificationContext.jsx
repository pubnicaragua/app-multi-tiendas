"use client"

import { createContext, useState, useEffect } from "react"
import supabase from "../utils/supabase"

export const NotificationContext = createContext(undefined)

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    // Función para cargar notificaciones iniciales
    const fetchNotifications = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false })

            if (error) throw error

            setNotifications(data || [])
            const unread = data?.filter((n) => !n.is_read).length || 0
            setUnreadCount(unread)
        } catch (error) {
            console.error("Error al cargar notificaciones:", error)
        } finally {
            setLoading(false)
        }
    }

    // Configurar suscripción en tiempo real
    useEffect(() => {
        fetchNotifications()

        // Crear el canal y la suscripción
        const channel = supabase.channel("db-changes", {
            config: {
                broadcast: { self: true },
                presence: { key: "notifications" },
            },
        })

        // Suscribirse a cambios en la tabla notifications
        channel
            .on(
                "postgres_changes",
                {
                    event: "*", // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
                    schema: "public",
                    table: "notifications",
                },
                async (payload) => {
                    console.log("Cambio recibido:", payload)

                    // Manejar diferentes tipos de eventos
                    switch (payload.eventType) {
                        case "INSERT":
                            setNotifications((prev) => [payload.new, ...prev])
                            if (!payload.new.is_read) {
                                setUnreadCount((prev) => prev + 1)
                            }
                            break

                        case "UPDATE":
                            setNotifications((prev) =>
                                prev.map((notification) => (notification.id === payload.new.id ? payload.new : notification)),
                            )
                            // Actualizar contador si cambió el estado de lectura
                            if (payload.old.is_read !== payload.new.is_read) {
                                setUnreadCount((prev) => (payload.new.is_read ? prev - 1 : prev + 1))
                            }
                            break

                        case "DELETE":
                            setNotifications((prev) => prev.filter((notification) => notification.id !== payload.old.id))
                            if (!payload.old.is_read) {
                                setUnreadCount((prev) => prev - 1)
                            }
                            break
                    }
                },
            )
            .subscribe((status) => {
                console.log("Status de la suscripción:", status)
                if (status === "SUBSCRIBED") {
                    console.log("Suscripción exitosa al canal de notificaciones")
                }
            })

        // Limpiar suscripción al desmontar
        return () => {
            channel.unsubscribe()
        }
    }, [])

    // Función para marcar una notificación como leída
    const markAsRead = async (id) => {
        try {
            const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id)

            if (error) throw error

            // El estado se actualizará automáticamente a través de la suscripción en tiempo real
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error)
        }
    }

    // Función para marcar todas las notificaciones como leídas
    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

            if (unreadIds.length === 0) return

            const { error } = await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds)

            if (error) throw error

            // El estado se actualizará automáticamente a través de la suscripción en tiempo real
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error)
        }
    }

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications,
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

