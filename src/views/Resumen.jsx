import { Users, UserCircle, ChevronLeft, Store, CheckCircle, Smartphone } from "lucide-react"
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import Requests from "../components/RecentRequests";
import Tiendas from "./Tiendas";

function Resumen() {
    const [stats, setStats] = useState({
        totalStores: 0,
        activeStores: 0,
        totalClients: 0,
        totalDevices: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: storesData, error: storesError } = await supabase
                    .from("store")
                    .select("id, is_active")

                if (storesError) throw storesError
                console.log("Tiendas", storesData)

                const { data: clientsData, error: clientsError } = await supabase
                    .from("clients")
                    .select("id", { count: "exact" });

                if (clientsError) throw clientsError
                console.log("Clientes", clientsData)

                const { data: devicesData, error: devicesError } = await supabase
                    .from("devices")
                    .select("id", { count: "exact" });

                if (devicesError) throw clientsError
                console.log("Dispositivos", devicesData)

                //Calcular las estadisticas
                setStats({
                    totalStores: storesData.length || 0,
                    activeStores: storesData.filter((store) => store.is_active).length || 0,
                    totalClients: clientsData.length || 0,
                    totalDevices: devicesData.length || 0
                });
            } catch (error) {
                console.error("Error obteniendo estadisticas", error);
            }
        }
        fetchData();
    }, []);

    //Definir las estadísticas con íconos y colores
    const statsData = [
        { id: 1, label: "Tiendas Totales", value: stats.totalStores, icon: Store, color: "text-blue-600" },
        { id: 2, label: "Tiendas Activas", value: stats.activeStores, icon: CheckCircle, color: "text-green-600" },
        { id: 3, label: "Clientes", value: stats.totalClients, icon: Users, color: "text-orange-600" },
        { id: 4, label: "Dispositivos", value: stats.totalDevices, icon: Smartphone, color: "text-pink-600" },
    ];

    return (
        <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">¡Bienvenido, Admin!</h2>
                    <p className="text-gray-300 mt-1">Panel de administración del sistema multi-tiendas</p>
                </div>
                <UserCircle color="white" width={42} height={42} />
            </div>

            {/* Mapeo de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                {statsData.map((stat) => (
                    <div
                        key={stat.id}
                        className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-4"
                    >
                        <div className={`p-3 rounded-full bg-opacity-10 ${stat.color}`}>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Requests />

            <Tiendas limit={3} title={'Tiendas Recientes'} />
        </div>
    )
}

export default Resumen