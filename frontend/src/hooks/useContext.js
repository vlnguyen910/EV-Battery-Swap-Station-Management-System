import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { StationContext } from "../contexts/StationContext";
import { BatteryContext } from "../contexts/BatteryContext";

export function useAuth() {
  return useContext(AuthContext);
}

export function useStation() {
  return useContext(StationContext);
}

export function useBattery() {
  return useContext(BatteryContext);
}