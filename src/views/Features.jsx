import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import supabase from "../utils/supabase";

const ProductConfigurator = () => {
    // Estado para módulos seleccionados y características
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState({});
    const [selectedFeatures, setSelectedFeatures] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const location = useLocation()
    const navigate = useNavigate()
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const storeData = localStorage.getItem("storeData");
        if (storeData) {
            setStoreData(JSON.parse(storeData));
        }
    }, [])


    useEffect(() => {
        const fetchModules = async () => {
            const { data: modulesData, error: modulesError } = await supabase.from("modules").select("*");
            if (modulesError) console.error("Error obteniendo módulos:", modulesError);
            console.log('Modulos: ', modulesData)

            const { data: featuresData, error: featuresError } = await supabase.from("features").select("*");
            if (featuresError) console.error("Error obteniendo características:", featuresError);
            console.log('Caracteristicas: ', featuresData)

            const { data: moduleFeaturesData, error: moduleFeaturesError } = await supabase.from("module_features").select("*");
            if (moduleFeaturesError) console.error("Error obteniendo relaciones módulo-característica:", moduleFeaturesError);
            console.log('Modulos Caracteristicas : ', moduleFeaturesData)

            // Mapear módulos con sus características asociadas
            const modulesWithFeatures = modulesData.map((module) => {
                const moduleFeatures = moduleFeaturesData
                    .filter((mf) => mf.module_id === module.id)
                    .map((mf) => featuresData.find((feature) => feature.id === mf.feature_id));

                return { ...module, features: moduleFeatures };
            });

            setModules(modulesWithFeatures);
        };

        fetchModules();
    }, []);


    // Manejar selección de módulos
    const handleModuleSelection = (moduleId) => {
        setSelectedModules(prev => {
            const newSelection = { ...prev };

            if (newSelection[moduleId]) {
                // Si ya está seleccionado, lo quitamos
                delete newSelection[moduleId];

                // Eliminamos las características seleccionadas de este módulo
                const newFeatures = { ...selectedFeatures };
                const module = modules.find(m => m.id === moduleId);
                if (module) {
                    module.features.forEach(feature => {
                        delete newFeatures[feature.id];
                    });
                }
                setSelectedFeatures(newFeatures);
            } else {
                // Si no está seleccionado, lo añadimos
                const module = modules.find(m => m.id === moduleId);
                newSelection[moduleId] = module;
            }

            return newSelection;
        });
    };

    // Manejar selección de características
    const handleFeatureSelection = (featureId, moduleId) => {
        setSelectedFeatures(prev => {
            const newSelection = { ...prev };

            if (newSelection[featureId]) {
                // Si ya está seleccionado, lo quitamos
                delete newSelection[featureId];
            } else {
                // Si no está seleccionado, lo añadimos
                const module = modules.find(m => m.id === moduleId);
                const feature = module.features.find(f => f.id === featureId);
                newSelection[featureId] = { ...feature, moduleId };
            }

            return newSelection;
        });
    };

    // Calcular precio total
    useEffect(() => {
        let total = 0;

        // Sumar precio base de módulos seleccionados
        Object.values(selectedModules).forEach(module => {
            total += module.price;
        });

        // Sumar precio de características seleccionadas
        Object.values(selectedFeatures).forEach(feature => {
            total += feature.price;
        });

        setTotalPrice(total);
    }, [selectedModules, selectedFeatures]);

    const handleSubmit = async () => {
        setLoading(true)

        try {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser()

            if (authError || !user) {
                throw new Error("No se encontró un usuario autenticado.")
            }

            // Recuperar datos de la tienda desde localStorage
            const storeData = JSON.parse(localStorage.getItem("storeData"));
            if (!storeData) {
                throw new Error("No se encontraron datos de la tienda. Regresa y completa la información.");
            }

            // Insertar tienda en Supabase
            const { data: storeInsertData, error: storeError } = await supabase.from("store").insert([storeData]).select();
            if (storeError) throw storeError;

            const storeId = storeInsertData[0].id;

            // 1. Insertar en user_store
            const { error: userStoreError } = await supabase.from("user_store").insert([
                {
                    user_id: user.id,
                    store_id: storeId,
                    created_at: new Date(),
                },
            ])
            if (userStoreError) throw userStoreError

            // 2. Preparar los datos para insertar en selected_module_features
            // Usamos un Map para evitar duplicados, usando una clave única para cada combinación
            const selectedModuleFeaturesMap = new Map();

            // Primero, procesamos los módulos seleccionados
            Object.values(selectedModules).forEach((module) => {
                // Verificamos si hay características seleccionadas para este módulo
                //const hasSelectedFeatures = module.features.some(feature => selectedFeatures[feature.id]);

                // Luego agregamos las características seleccionadas para este módulo
                module.features.forEach((feature) => {
                    if (selectedFeatures[feature.id]) {
                        const featureKey = `module-${module.id}-feature-${feature.id}`;
                        selectedModuleFeaturesMap.set(featureKey, {
                            module_id: module.id,
                            feature_id: feature.id,
                            store_id: storeId,
                            user_id: user.id,
                            is_confirmed: false
                        });
                    }
                });
            });

            // Convertir Map en Array para la inserción
            const insertArray = Array.from(selectedModuleFeaturesMap.values());

            // Insertar todas las selecciones
            const { error: selectionError } = await supabase.from("selected_module_features").insert(insertArray)
            if (selectionError) throw selectionError

            const { error: notificationError } = await supabase.from("notifications").insert([
                {
                    message: "Nueva solicitud de tienda",
                    is_read: false,
                    type: 1,
                    created_at: new Date(),
                },
            ])
            if (notificationError) throw notificationError

            // Redireccionar al dashboard
            navigate("/user/dashboard")
        } catch (error) {
            console.error("Error al guardar la configuración:", error)
            alert("Ocurrió un error al guardar tu configuración. Por favor, intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-2">Configurador de Producto</h1>
            <p className="text-gray-600 text-center mb-8">Selecciona los módulos y características que necesitas</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {modules.map(module => (
                    <div
                        key={module.id}
                        className={`border rounded-lg overflow-hidden transition-all duration-200 ${selectedModules[module.id] ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
                            }`}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold mb-2">{module.name}</h2>
                                    <p className="text-gray-600 mb-3">{module.description}</p>
                                    <div className="text-2xl font-bold text-blue-600">${module.price}</div>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id={`module-${module.id}`}
                                        className="w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={!!selectedModules[module.id]}
                                        onChange={() => handleModuleSelection(module.id)}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-6 pt-4">
                                <h3 className="font-medium mb-3">Características disponibles:</h3>
                                <div className="space-y-3">
                                    {module.features.map(feature => (
                                        <div key={feature.id} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`feature-${feature.id}`}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={!!selectedFeatures[feature.id]}
                                                    onChange={() => handleFeatureSelection(feature.id, module.id)}
                                                    disabled={!selectedModules[module.id]}
                                                />
                                                <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm text-gray-700">
                                                    {feature.name}
                                                </label>
                                            </div>
                                            <span className="text-sm font-medium">${feature.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen y Total */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Resumen de tu configuración</h2>

                {Object.keys(selectedModules).length === 0 ? (
                    <p className="text-gray-500 italic">No has seleccionado ningún módulo</p>
                ) : (
                    <div className="space-y-6">
                        {Object.values(selectedModules).map(module => (
                            <div key={module.id} className="border-b border-gray-200 pb-4 last:border-0">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{module.name}</span>
                                    <span className="font-medium">${module.price}</span>
                                </div>

                                {/* Características del módulo seleccionadas */}
                                <div className="ml-4 space-y-1">
                                    {module.features
                                        .filter(feature => selectedFeatures[feature.id])
                                        .map(feature => (
                                            <div key={feature.id} className="flex justify-between text-sm">
                                                <span className="text-gray-600">+ {feature.name}</span>
                                                <span className="text-gray-600">${feature.price}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || Object.keys(selectedModules).length === 0}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400"
                        >
                            {loading ? "Guardando configuración..." : "Finalizar registro"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductConfigurator;
