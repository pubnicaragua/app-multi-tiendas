"use client"

import { useState, useEffect, useRef } from "react"
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { es } from "date-fns/locale"
import supabase from "../utils/supabase"

export default function PaymentHistory() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateRange, setDateRange] = useState({ from: null, to: null })
    const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" })
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null })

    const statusDropdownRef = useRef(null)
    const calendarRef = useRef(null)

    // Cerrar dropdowns al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setIsStatusDropdownOpen(false)
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            setLoading(true)
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) throw new Error("No se encontró usuario")

            const { data, error } = await supabase
                .from("payments")
                .select(`
          *,
          store:store_id (
            establishment_name
          )
        `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) throw error

            setPayments(data || [])
        } catch (error) {
            console.error("Error al cargar pagos:", error)
        } finally {
            setLoading(false)
        }
    }

    // Función para filtrar pagos
    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.store?.establishment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.payment_method_id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || payment.status === statusFilter

        let matchesDate = true
        if (dateRange.from && dateRange.to) {
            const paymentDate = new Date(payment.created_at)
            matchesDate = isWithinInterval(paymentDate, {
                start: startOfDay(dateRange.from),
                end: endOfDay(dateRange.to),
            })
        }

        return matchesSearch && matchesStatus && matchesDate
    })

    // Función para ordenar pagos
    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (sortConfig.key === "amount") {
            return sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount
        }
        return sortConfig.direction === "asc"
            ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
            : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key])
    })

    // Función para exportar a CSV
    const exportToCSV = () => {
        const headers = ["Fecha", "Tienda", "Monto", "Estado", "Método de Pago"]
        const csvData = sortedPayments.map((payment) => [
            format(new Date(payment.created_at), "dd/MM/yyyy HH:mm"),
            payment.store?.establishment_name,
            `$${payment.amount}`,
            payment.status,
            payment.payment_method_id,
        ])

        const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `historial-pagos-${format(new Date(), "dd-MM-yyyy")}.csv`
        link.click()
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "failed":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "completed":
                return "Completado"
            case "pending":
                return "Pendiente"
            case "failed":
                return "Fallido"
            default:
                return status
        }
    }

    // Funciones para el calendario simplificado
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const handleDateClick = (date) => {
        if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
            // Si no hay fecha inicial o ambas fechas están seleccionadas, establecer nueva fecha inicial
            setSelectedDates({ start: date, end: null })
        } else {
            // Si ya hay fecha inicial pero no final
            if (date < selectedDates.start) {
                setSelectedDates({ start: date, end: selectedDates.start })
            } else {
                setSelectedDates({ start: selectedDates.start, end: date })
            }
        }
    }

    const applyDateFilter = () => {
        if (selectedDates.start && selectedDates.end) {
            setDateRange({ from: selectedDates.start, to: selectedDates.end })
        } else if (selectedDates.start) {
            setDateRange({ from: selectedDates.start, to: selectedDates.start })
        }
        setIsCalendarOpen(false)
    }

    const clearDateFilter = () => {
        setSelectedDates({ start: null, end: null })
        setDateRange({ from: null, to: null })
        setIsCalendarOpen(false)
    }

    const renderCalendar = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = getFirstDayOfMonth(year, month)

        const days = []
        // Días vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const isSelected =
                (selectedDates.start && date.getTime() === selectedDates.start.getTime()) ||
                (selectedDates.end && date.getTime() === selectedDates.end.getTime())

            const isInRange =
                selectedDates.start && selectedDates.end && date > selectedDates.start && date < selectedDates.end

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isSelected ? "bg-blue-500 text-white" : ""}
            ${isInRange ? "bg-blue-100" : ""}
            hover:bg-gray-200`}
                >
                    {day}
                </button>,
            )
        }

        return days
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filtros y Controles */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-1 gap-4 w-full sm:w-auto flex-wrap">
                    <div className="relative flex-1 sm:max-w-xs">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por tienda o método de pago..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Dropdown de estado */}
                    <div className="relative" ref={statusDropdownRef}>
                        <button
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="w-[180px] px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center"
                        >
                            <span className="text-gray-700">
                                {statusFilter === "all"
                                    ? "Todos"
                                    : statusFilter === "completed"
                                        ? "Completados"
                                        : statusFilter === "pending"
                                            ? "Pendientes"
                                            : "Fallidos"}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        {isStatusDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setStatusFilter("all")
                                            setIsStatusDropdownOpen(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    >
                                        Todos
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStatusFilter("completed")
                                            setIsStatusDropdownOpen(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    >
                                        Completados
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStatusFilter("pending")
                                            setIsStatusDropdownOpen(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    >
                                        Pendientes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStatusFilter("failed")
                                            setIsStatusDropdownOpen(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    >
                                        Fallidos
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selector de fechas */}
                    <div className="relative" ref={calendarRef}>
                        <button
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="w-[180px] px-4 py-2 border border-gray-300 rounded-md bg-white flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span className="text-gray-700">
                                {dateRange.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "dd/MM/yyyy")
                                    )
                                ) : (
                                    "Seleccionar fechas"
                                )}
                            </span>
                        </button>

                        {isCalendarOpen && (
                            <div className="absolute z-10 mt-1 p-4 bg-white border border-gray-300 rounded-md shadow-lg">
                                <div className="mb-4 flex justify-between items-center">
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>
                                    <span className="font-medium">{format(currentMonth, "MMMM yyyy", { locale: es })}</span>
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {["D", "L", "M", "X", "J", "V", "S"].map((day) => (
                                        <div
                                            key={day}
                                            className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-500"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={clearDateFilter}
                                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        Limpiar
                                    </button>
                                    <button
                                        onClick={applyDateFilter}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={exportToCSV}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar CSV
                </button>
            </div>

            {/* Tabla de Pagos */}
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() =>
                                        setSortConfig({
                                            key: "created_at",
                                            direction: sortConfig.key === "created_at" && sortConfig.direction === "asc" ? "desc" : "asc",
                                        })
                                    }
                                >
                                    <div className="flex items-center">
                                        Fecha
                                        {sortConfig.key === "created_at" && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-1 h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {sortConfig.direction === "asc" ? (
                                                    <polyline points="18 15 12 9 6 15"></polyline>
                                                ) : (
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                )}
                                            </svg>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Tienda
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() =>
                                        setSortConfig({
                                            key: "amount",
                                            direction: sortConfig.key === "amount" && sortConfig.direction === "asc" ? "desc" : "asc",
                                        })
                                    }
                                >
                                    <div className="flex items-center">
                                        Monto
                                        {sortConfig.key === "amount" && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-1 h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {sortConfig.direction === "asc" ? (
                                                    <polyline points="18 15 12 9 6 15"></polyline>
                                                ) : (
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                )}
                                            </svg>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Estado
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Número de pago
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron pagos
                                    </td>
                                </tr>
                            ) : (
                                sortedPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payment.store?.establishment_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}
                                            >
                                                {getStatusText(payment.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.payment_method_id}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

