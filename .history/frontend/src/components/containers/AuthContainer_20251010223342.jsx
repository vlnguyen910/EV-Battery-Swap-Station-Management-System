import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAsyncHandler from "../../hooks/useAsyncHandler";
import Login from "../auth/Login";
import Register from "../auth/Register";

function handleLogin() {
    const { login } = useAuth();

    const { run, loading, error } = useAsyncHandler(
        async (credentials) => {
            const user =
    )


}