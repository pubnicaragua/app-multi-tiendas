import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ user, storeId, totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            setError("Stripe no está cargado correctamente.");
            setLoading(false);
            return;
        }

        // Crear método de pago con Stripe
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Guardar el pago en Supabase
        const { data, error: supabaseError } = await supabase
            .from("payments")
            .insert([
                {
                    user_id: user.id,
                    store_id: storeId,
                    payment_method_id: paymentMethod.id,
                    status: "pending",
                    amount: totalAmount, // Ajusta el precio real
                },
            ]);

        if (supabaseError) {
            setError("Error al guardar el pago en la base de datos.");
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);

        // 4. Mostrar mensaje de éxito y redirigir
        alert("¡Pago completado con éxito!")
        navigate("/user/dashboard")
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Total a Pagar: ${totalAmount}</h2>

            <div className="border p-3 rounded-lg mb-4">
                <CardElement />
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                {loading ? "Procesando..." : "Pagar"}
            </button>

            {error && <p className="text-red-500 mt-3">{error}</p>}
            {success && <p className="text-green-500 mt-3">Pago exitoso 🎉</p>}
        </form>
    );
};

const Checkout = () => {
    const { storeId } = useParams();
    const [user, setUser] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error al obtener usuario:", error);
                return;
            }
            setUser(user);

            // Consultar el total de módulos y características seleccionadas en Supabase
            const { data: selectedModules, error: modulesError } = await supabase
                .from("selected_module_features")
                .select(`module:module_id(price), feature:feature_id(price)`)
                .eq("user_id", user.id)
                .eq("store_id", storeId);

            if (modulesError) {
                console.error("Error al obtener módulos:", modulesError);
                return;
            }

            // Calcular el total
            const total = selectedModules.reduce((sum, item) => sum + (item.module?.price || 0) + (item.feature?.price || 0), 0);
            setTotalAmount(total);
            setLoading(false);
        };

        fetchUserData();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (!user) return <p>Inicia sesión para continuar.</p>;

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm user={user} storeId={storeId} totalAmount={totalAmount} />
        </Elements>
    );
};


export default Checkout;
