import { Zap, ChartSpline, SquareKanban } from "lucide-react"
import AffiliationForm from "../components/AffiliationForm"

function Affiliation() {

    return (
        <div className="bg-gray-100">
            <h2 className="space-y-4 m-6 font-bold text-2xl">Beneficios Clave</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                <div className="p-4 bg-white shadow rounded-lg">
                    <div className="flex gap-3">
                        <div className="px-5 py-2 rounded-lg bg-lime-100 flex items-center">
                            <Zap color="green" />
                        </div>

                        <div>
                            <h3 className="font-semibold">Aprobacion rápida</h3>
                            <p>Proceso de financiamiento acelerado para tus clientes</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white shadow rounded-lg">
                    <div className="flex gap-3">
                        <div className="px-5 py-2 rounded-lg bg-blue-100 flex items-center">
                            <ChartSpline color="#3e9392" />
                        </div>

                        <div>
                            <h3 className="font-semibold">Aprobacion rápida</h3>
                            <p>Proceso de financiamiento acelerado para tus clientes</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white shadow rounded-lg">
                    <div className="flex gap-3">
                        <div className="px-5 py-2 rounded-lg bg-orange-100 flex items-center">
                            <SquareKanban color="#ff8633" />
                        </div>

                        <div>
                            <h3 className="font-semibold">Aprobacion rápida</h3>
                            <p>Proceso de financiamiento acelerado para tus clientes</p>
                        </div>
                    </div>
                </div>
            </div>

            <AffiliationForm />
        </div>
    )
}

export default Affiliation