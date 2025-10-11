import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAsyncHandler from "../../hooks/useAsyncHandler";
import Login from "../auth/Login";
import Register from "../auth/Register";

export function handleLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const { run, loading, error, success } = useAsyncHandler(
        async (credentials) => {
            const user = await login(credentials);
            // redirect base on role
            if (user.role === 'admin') {
                navigate("/admin");
            } else if (user.role === 'station_staff') {
                navigate("/staff");
            } else {
                navigate("/user");
            }
            return user;
        },
        { onError: (e) => console.error("Login error:", e) }
    );
    return { submit: run, loading, error, success };
}

function handleRegister() {
    const { run, loading, error } = useAsyncHandler(
        async (payload) => {
            const res = await register(payload);
            setTimeout(() => <Link to="/login" />, 1200);
            return res;
        }
    );
    return { submit: run, loading, error };
}

export default function AuthContainer({ mode }) {
    const { submit: loginSubmit, loading: loginLoading, error: loginError } = handleLogin();
    const { submit: registerSubmit, loading: registerLoading, error: registerError } = handleRegister();

    return (
        <div>
            {mode === "login" && (
                <Login onSubmit={loginSubmit} loading={loginLoading} error={loginError} />
            )}
            {mode === "register" && (
                <Register onSubmit={registerSubmit} loading={registerLoading} error={registerError} />
            )}
        </div>
    );
}
