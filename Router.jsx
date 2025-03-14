import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout"
import RegisterLayout from "./src/layouts/RegisterLayout"
import AdminLayout from "./src/layouts/AdminLayout";
import AuthLayout from "./src/layouts/AuthLayout";
import DashboardLayout from "./src/layouts/DashboardLayout";

import App from "./src/App";
import Home from "./src/views/Home";
import Celulares from "./src/views/Celulares"
import Register from "./src/views/Registro";
import Login from "./src/views/Login";
import Affiliation from "./src/views/Affiliation";
import Features from "./src/views/Features"
import Administration from "./src/views/Administration";
import Resumen from "./src/views/Resumen";
import Tiendas from "./src/views/Tiendas";
import Solicitudes from "./src/views/Solicitudes";
import Reportes from "./src/views/Reportes";
import UserDashboard from "./src/views/UserDashboard";
import TiendaUsuario from "./src/views/TiendaUsuario"
import Checkout from "./src/views/Checkout";
import WaitModule from "./src/components/WaitModule"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: 'home',
        element: <MainLayout />,
        children: [
            {
                index: 'true',
                element: <Home />
            },
            {
                path: 'celulares',
                element: <Celulares />
            }
        ]
    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]
    },
    {
        path: 'auth/register/affiliation',
        element: <RegisterLayout />,
        children: [
            {
                path: 'store',
                element: <Affiliation />
            },
            {
                path: 'features',
                element: <Features />
            }
        ]
    },
    {
        path: 'admin',
        element: <Administration />
    },
    {
        path: 'admin/manage/locations',
        element: <WaitModule />
    },
    {
        path: 'admin/manage/modules',
        element: <WaitModule />
    },
    {
        path: 'admin/manage/associates',
        element: <WaitModule />
    },
    {
        path: 'admin/manage',
        element: <AdminLayout />,
        children: [
            {
                path: 'resume',
                element: <Resumen />
            },
            {
                path: 'stores',
                element: <Tiendas />
            },
            {
                path: 'requests',
                element: <Solicitudes />
            },
            {
                path: 'reports',
                element: <WaitModule />
            }
        ]
    },
    {
        path: 'user',
        element: <DashboardLayout />,
        children: [
            {
                path: 'confirmation',
                element: <UserDashboard />
            },
            {
                path: 'store',
                element: <TiendaUsuario />
            },
            {
                path: 'resume',
                element: <WaitModule />
            },
            {
                path: 'payments',
                element: <WaitModule />
            },
            {
                path: 'reports',
                element: <WaitModule />
            }
        ]
    },
    {
        path: 'checkout/:storeId',
        element: <Checkout />
    }
])

export default router