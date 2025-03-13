import { modules, pendingRequests, stores } from "../utils/data"
import { User, UserCircle, ChevronLeft, Store } from "lucide-react"

function Resumen() {
    return (
        <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">¡Bienvenido, Admin!</h2>
                    <p className="text-gray-300 mt-1">Panel de administración del sistema multi-tiendas</p>
                </div>
                <UserCircle color="white" width={42} height={42} />
            </div>

            {/*Grid de modulos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                {modules.map((module) => (
                    <div
                        key={module.id}
                        className="bg-white rounded-lg p-6 shadow-md hover:cursor-pointer hover:bg-gray-100
                                        transition-all duration-300 ease-in-out"
                    >

                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${module.color} bg-opacity-10 bg-blue-900`}>
                                <module.icon className={`h-6 w-6 ${module.color}`} />
                            </div>

                            <div className="ml-4">
                                <p className="text-md font-medium text-gray-600">
                                    {module.name}
                                </p>

                                <p className="text-sm font-medium text-gray-500">
                                    {module.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )
                )}
            </div>

            <h2 className="mt-5 mb-4 text-lg font-medium">Solicitudes pendientes</h2>

            <div className="bg-white rounded-lg shadow-sm divide-y">
                {pendingRequests.map((request) => (
                    <div key={request.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center">
                                    <h4 className="text-lg font-medium text-gray-900">{request.name}</h4>
                                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pendiente
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {request.location} • {request.time}
                                </p>
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <ChevronLeft className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Dirección:</p>
                                <p className="font-medium">{request.address}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Email:</p>
                                <p className="font-medium">{request.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Teléfono:</p>
                                <p className="font-medium">{request.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Módulos:</p>
                                <p className="font-medium">{request.modules}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                                Rechazar
                            </button>
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                Aprobar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="mt-5 mb-4 text-lg font-medium">Tiendas Recientes</h2>

            <div className="bg-white rounded-lg shadow-sm divide-y">
                {stores.map((store) => (
                    <div key={store.id} className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Store className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900">{store.name}</h4>
                                    <p className="text-sm text-gray-500">{store.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${store.status === "Activo"
                                            ? "bg-green-100 text-green-800"
                                            : store.status === "Inactivo"
                                                ? "bg-gray-100 text-gray-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {store.status}
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
                            <p className="text-sm text-gray-500">Afiliado desde: {store.affiliationDate}</p>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                Gestionar
                                <ChevronLeft className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default Resumen