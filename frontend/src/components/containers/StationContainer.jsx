import { useStationHandler } from "../../hooks/useStationHandler";
import MapPage from "../../pages/Map";

export default function StationContainer({ mode }) {
    const { loading, runGetAllStations, getAllStationsLoading } = useStationHandler();

    const handleGetAllStations = () => {
        runGetAllStations();
    };

    return (
        <div>
            {mode === "getAllStations" && (
                <MapPage
                    onGetAllStations={handleGetAllStations}
                    loading={loading || getAllStationsLoading}
                />
            )}
        </div>
    );
}
