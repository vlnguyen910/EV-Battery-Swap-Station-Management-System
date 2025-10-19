import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { StationContext } from "../contexts/StationContext";

export function useAuth() {
  return useContext(AuthContext);
}

export function useStation() {
  return useContext(StationContext);
}
