import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAsyncHandler from "../../hooks/useAsyncHandler";
import Login from "../auth/Login";
import Register from "../auth/Register";



export default function AuthContainer({ mode }) {
    const { submit: loginSubmit, loading: loginLoading, error: loginError, success: loginSuccess } = handleLogin();
    const { submit: registerSubmit, loading: registerLoading, error: registerError, success: registerSuccess } = handleRegister();

    return (
        <div>
            {mode === "login" && (
                <Login onSubmit={loginSubmit} loading={loginLoading} error={loginError} success={loginSuccess} />
            )}
            {mode === "register" && (
                <Register onSubmit={registerSubmit} loading={registerLoading} error={registerError} success={registerSuccess} />
            )}
        </div>
    );
}
