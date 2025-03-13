import { Store, Handshake, BriefcaseBusiness, ShieldUser, ShieldCheck, ChartColumn, Component } from "lucide-react"

export const modules = [
    {
        id: 1,
        name: "Mapa de Tiendas",
        description: "Descripcion",
        icon: Store,
        link: "/stores",
        color: "text-blue-600"
    },
    {
        id: 2,
        name: "Afiliación",
        description: "Descripcion",
        icon: Handshake,
        link: "/afiliation",
        color: "text-green-600"
    },
    {
        id: 3,
        name: "Portal de Socios",
        description: "Descripcion",
        icon: BriefcaseBusiness,
        link: "/associates",
        color: "text-orange-600"
    },
    {
        id: 4,
        name: "Administración",
        description: "Descripcion",
        icon: ShieldUser,
        link: "/admin/manage/resume",
        color: "text-pink-600"
    }
];

export const features = [
    {
        id: 1,
        name: "Sistema Modular",
        description: "Selecciona los módulos específicos que necesita tu negocio para una experiencia personalizada.",
        icon: Component,
    },
    {
        id: 2,
        name: "Gestión Segura",
        description: "Administra dispositivos, finanzas y clientes en un entorno completamente seguro.",
        icon: ShieldCheck,
    },
    {
        id: 3,
        name: "Reportes Avanzados",
        description: "Visualiza estadísticas y reportes detallados para la toma de decisiones estratégicas.",
        icon: ChartColumn,
    }
]

export const pendingRequests = [
    {
        id: 1,
        name: "SmartFix Guadalajara",
        location: "Guadalajara",
        time: "2 hours ago",
        address: "Av. Chapultepec 456, Col. Americana",
        email: "info@smartfix.com",
        phone: "(33) 3123-4567",
        modules: "5 módulos seleccionados",
    },
]

export const stores = [
    {
      id: 1,
      name: "TechZone Monterrey",
      location: "Monterrey",
      time: "1 day ago",
      status: "Pendiente",
      modules: 15,
      clients: 248,
      devices: 127,
      affiliationDate: "15/01/2023",
    },
    {
      id: 2,
      name: "MatrixCell Centro",
      location: "CDMX",
      status: "Activo",
      modules: 12,
      clients: 156,
      devices: 94,
      affiliationDate: "03/02/2023",
    },
    {
      id: 3,
      name: "Móvil Express Reforma",
      location: "CDMX",
      status: "Inactivo",
      modules: 8,
      clients: 87,
      devices: 54,
      affiliationDate: "22/02/2023",
    },
  ]



