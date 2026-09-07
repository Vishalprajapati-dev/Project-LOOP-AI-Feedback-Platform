import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import "./MainLayout.css";

function MainLayout() {
    return (
        <div className="main-layout">

            <Sidebar />

            <div className="layout-content">

                <Topbar />

                <main className="page-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;