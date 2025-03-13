import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const enlaces = {
        Celulares: "/celulares",
        Préstamos: "",
        "Vende con PayStore": "",
        Vacantes: "",
        "Sobre Nosotros": "",
        Blog: "",
    };

    function handleLinkClick(path, item) {
        if (!path) {
            alert(`Módulo "${item}" próximamente`);
        }
    }

    return (
        <header className="flex justify-between items-center p-6">
            <h1 className="text-blue-900 font-extrabold text-2xl">
                PAY<span className="text-orange-600">STORE</span>
            </h1>

            <nav className="hidden md:flex gap-6 text-lg">
                {Object.keys(enlaces).map((item) => {
                    const path = enlaces[item];
                    const isActive = location.pathname === path;

                    return (
                        <div
                            key={item}
                            onClick={() => handleLinkClick(path, item)}
                            className="cursor-pointer"
                        >
                            <Link
                                to={path || "#"}
                                className={`relative text-gray-700 hover:text-black after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${isActive ? "after:w-full text-black" : ""
                                    }`}
                            >
                                {item}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            <div className="flex items-center gap-3">
                <Globe />

                <select className="border p-2 rounded-md bg-none border-none hover:bg-gray-200">
                    {["Ecuador", "Perú", "Colombia", "Chile"].map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="text-black bg-white shadow-md border rounded-md 
                py-3 px-6 hover:bg-blue-950 transition duration-300 hover:text-white"
                onClick={() => navigate('/auth/login')}
            >
                Acceso socios
            </button>
        </header>
    );
}

export default Header;