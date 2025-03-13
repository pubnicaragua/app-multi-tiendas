import Header from "../components/AffiliationHeader";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function Layout() {

    return (
        <div>
            <Header />

            <Outlet />

            <Footer />
        </div>
    )
}
export default Layout;