import { AuthContext } from "../contexts/AuthContext";
export function useAuth() {
  return useContext(AuthContext);
}
