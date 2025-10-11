import Login from "../auth/Login";
import Register from "../auth/Register";
import { useLoginHandler, useRegisterHandler } from "../../hooks/useAuthHandlers";

export default function AuthContainer({ mode }) {
    const { run: loginSubmit, loading: loginLoading, error: loginError, success: loginSuccess } = useLoginHandler();
    const { run: registerSubmit, loading: registerLoading, error: registerError, success: registerSuccess } = useRegisterHandler();

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