import Login from "../auth/Login";
import Register from "../auth/Register";
import CreateStaffForm from "../../pages/AdminPage";
import { useAuthHandler } from "../../hooks/useAuthHandler";

export default function AuthContainer({ mode }) {
    const {
        login,
        register,
        loading,
        createStaffAccount,
    } = useAuthHandler();

    const handleLogin = async (data) => {
        try {
            await login(data);
        } catch (e) {
            console.error("Login failed:", e);
        }
    };

    const handleRegister = async (data) => {
        try {
            await register(data);
        } catch (e) {
            console.error("Register failed:", e);
        }
    };

    const handleCreateStaff = async (data) => {
        console.log('AuthContainer.handleCreateStaff called with:', data);
        try {
            const res = await createStaffAccount(data);
            console.log('AuthContainer.handleCreateStaff result:', res);
            return res;
        } catch (e) {
            console.error("Create staff failed:", e);
            // Re-throw so the form component can display the error to the user
            throw e;
        }
    };

    return (
        <div>
            {mode === "login" && (
                <Login onSubmit={handleLogin} loading={loading} />
            )}
            {mode === "register" && (
                <Register onSubmit={handleRegister} loading={loading} />
            )}
            {mode === "createStaff" && (
                <CreateStaffForm onSubmit={handleCreateStaff} loading={loading} error={null} success={null} />
            )}
        </div>
    );
}
