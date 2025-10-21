import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { StationContext } from "../contexts/StationContext";
import { BatteryContext } from "../contexts/BatteryContext";
import { ReservationContext } from "../contexts/ReservationContext";
import { PackageContext } from "../contexts/PackageContext";

export function useAuth() {
  return useContext(AuthContext);
}

export function useStation() {
  return useContext(StationContext);
}

export function useBattery() {
  return useContext(BatteryContext);
}

export function useReservation() {
  return useContext(ReservationContext);
}

export function usePackage() {
  return useContext(PackageContext);
}