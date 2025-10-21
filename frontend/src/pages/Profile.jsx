import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useContext";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="p-6">
                {/* Trang con sẽ render ở đây */}
                <Outlet />
            </main>


        </div>
    );
}
