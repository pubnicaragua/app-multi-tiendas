import { ChevronLeft, User, UserCircle, Store, Handshake, BriefcaseBusiness, ShieldUser } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { modules, features } from "../utils/data";
import NotificationBell from "../components/NotificationBell"
import UserProfileMenu from "../components/UserProfileMenu"

function Administration() {

    const navigate = useNavigate();

    return (
        <div className="bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 my-10">
                <div className="flex items-center justify-between mb-8 h-16">
                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-semibold text-gray-900">
                                Panel de Administrador
                            </h1>

                            <p className="font-semibold text-gray-900">Sistema de Gestión Multi-tiendas</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationBell />
                        <UserProfileMenu />
                    </div>
                </div>

                {/*Grid de modulos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="bg-white rounded-lg p-6 shadow-md hover:cursor-pointer hover:bg-gray-100
                            transition-all duration-300 ease-in-out"
                            onClick={() => navigate(module.link)}>

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

                <h2 className="mt-5 mb-4 text-lg font-medium">Caracteristicas destacadas</h2>

                {/**Caracteristicas destacadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="bg-white rounded-lg p-6 shadow-md">

                            <div className="flex items-center">
                                <div className={`p-2 bg-indigo-300 rounded-lg bg-opacity-10`}>
                                    <feature.icon className={`h-6 w-6`} />
                                </div>

                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        {feature.name}
                                    </p>

                                    <p className="text-sm font-medium text-gray-500">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                    )}
                </div>
            </div>
        </div>
    )
}

export default Administration