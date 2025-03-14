import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { Store, ChevronLeft } from "lucide-react";

function Tiendas({ limit = null, title = '' }) {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);

            // Obtener todas las tiendas
            let query = supabase
                .from("store")
                .select("id, establishment_name, address, is_active, created_at")
                .order("created_at", { ascending: false })

            if (limit) {
                query = query.limit(limit);
            }

            let { data: storesData, error: storesError } = await query;


            if (storesError) {
                console.error("Error obteniendo tiendas:", storesError);
                setLoading(false);
                return;
            }

            //Obtener el número de módulos por tienda
            let { data: modulesData } = await supabase
                .from("selected_module_features")
                .select("store_id, is_confirmed, module_id", { count: "exact" })


            console.log(modulesData.length)

            // Obtener el número de clientes por tienda
            let { data: clientsData } = await supabase
                .from("clients")
                .select("store_id", { count: "exact" });

            //Obtener el número de dispositivos por tienda
            let { data: devicesData } = await supabase
                .from("devices")
                .select("store_id", { count: "exact" });

            // Unir los datos en un solo objeto
            const storesWithCounts = storesData.map((store) => ({
                ...store,
                modules: modulesData.filter((module) => module.store_id === store.id).length,
                clients: clientsData.filter((client) => client.store_id === store.id).length,
                devices: devicesData.filter((device) => device.store_id === store.id).length,
            }));


            setStores(storesWithCounts);
            setLoading(false);
        };


        fetchStores();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Cargando tiendas...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{title ? title : 'Administración de Tiendas'}</h2>

            <div className="bg-white rounded-lg shadow-sm divide-y">
                {stores.map((store) => (
                    <div key={store.id} className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Store className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900">{store.establishment_name}</h4>
                                    <p className="text-sm text-gray-500">{store.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${store.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {store.is_active ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-semibold text-gray-900">{store.modules}</p>
                                <p className="text-sm text-gray-500">Módulos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-semibold text-gray-900">{store.clients}</p>
                                <p className="text-sm text-gray-500">Clientes</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-semibold text-gray-900">{store.devices}</p>
                                <p className="text-sm text-gray-500">Dispositivos</p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Afiliado desde: {new Date(store.created_at).toLocaleDateString()}
                            </p>
                            {/* <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                Gestionar
                                <ChevronLeft className="ml-1 h-4 w-4" />
                            </button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tiendas;
