import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row items-center md:gap-6 max-w-4xl w-full">
                {/* Imagen más pequeña y centrada */}
                <img src="/paystore4.png" alt="Paystore Logo" className="hidden md:block w-1/2 max-w-xl" />

                {/* Aquí se renderiza el formulario (Login o Register) */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
