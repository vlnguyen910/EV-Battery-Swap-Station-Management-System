import { useAuth } from "./useContext";
import useAsyncHandler from "./useAsyncHandler";
import { useNavigate } from "react-router-dom";

export function useStationHandler() {
  const { getAllStations, getStationById } = useStation();
  const navigate = useNavigate();

  const { run: runGetAllStations, loading: getAllStationsLoading } =
    useAsyncHandler(
      async () => {
        const stations = await getAllStations();
        return stations;
      },
      { onError: (e) => console.error("Get all stations error:", e) }
    );

  const { run: runGetStationById, loading: getStationByIdLoading } =
    useAsyncHandler(
      async (id) => {
        const station = await getStationById(id);
        return station;
      },
      { onError: (e) => console.error("Get station by ID error:", e) }
    );

  return {
    runGetAllStations,
    getAllStationsLoading,
    runGetStationById,
    getStationByIdLoading,
  };
}
