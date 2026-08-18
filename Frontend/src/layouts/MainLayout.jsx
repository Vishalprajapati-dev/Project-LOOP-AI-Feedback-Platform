import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import "./MainLayout.css";

function MainLayout({ children }) {
    return (
        <div className="main-layout">

            <Sidebar />

            <div className="layout-content">

                <Topbar />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default MainLayout;