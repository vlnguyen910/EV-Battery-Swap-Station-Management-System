import { useAuth } from "./useContext";
import useAsyncHandler from "./useAsyncHandler";
import { useNavigate } from "react-router-dom";

export function useStationHandler() {
  const { getAllStations } = useStation();
  const navigate = useNavigate();

  const { run: runGetAllStations, loading: getAllStationsLoading } =
    useAsyncHandler(
      async () => {
        const stations = await getAllStations();
        return stations;
      },
      { onError: (e) => console.error("Get all stations error:", e) }
    );

  return {
    runGetAllStations,
    getAllStationsLoading,
  };
}
