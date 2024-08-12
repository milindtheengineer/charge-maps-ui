import { useEffect, useState, useRef } from "react";
import data from "./target-stores.json";
import Map, { MapRef, NavigationControl, Marker, Popup } from 'react-map-gl/maplibre';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { MapElement } from "./MapData";
import MapStyle from "./Style";
import superchargerIcon from "./supercharger.png";
import storeIcon from "./store.png";
import "./styles.css";


interface ViewState {
    latitude: number;
    longitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
}

const MapView = () => {
    const mapRef = useRef<MapRef | null>(null);
    const [superchargers, setSuperchargers] = useState<MapElement[]>([]);
    const [stores, setStores] = useState<MapElement[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MapElement | null>(null);

    const [viewport, setViewport] = useState<ViewState>({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 10,
    });

    useEffect(() => {
        const protocol = new Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);
        // Parse the data from your JSON file
        const parsedNodeSuperchargers = data.elements
            .filter(
                (e) =>
                    e.tags &&
                    e.tags.amenity === "charging_station" &&
                    e.tags.operator === "Tesla, Inc."
            )
            .filter(
                (e) =>
                    e.type === "node" &&
                    typeof e.lon === "number" &&
                    typeof e.lat === "number" &&
                    !isNaN(e.lon) &&
                    !isNaN(e.lat)
            );
        const parsedNodeStores = data.elements
            .filter((e) => e.tags && e.tags.brand === "Target")
            .filter(
                (e) =>
                    e.type === "node" &&
                    typeof e.lon === "number" &&
                    typeof e.lat === "number" &&
                    !isNaN(e.lon) &&
                    !isNaN(e.lat)
            );
        const parsedWaySuperchargers = data.elements
            .filter(
                (e) =>
                    e.tags &&
                    e.tags.amenity === "charging_station" &&
                    e.tags.operator === "Tesla, Inc."
            )
            .filter(
                (e) =>
                    e.type === "way" &&
                    e.center &&
                    typeof e.center.lon === "number" &&
                    typeof e.center.lat === "number" &&
                    !isNaN(e.center.lon) &&
                    !isNaN(e.center.lat)
            );
        const parsedWayStores = data.elements
            .filter((e) => e.tags && e.tags.brand === "Target")
            .filter(
                (e) =>
                    e.type === "way" &&
                    e.center &&
                    typeof e.center.lon === "number" &&
                    typeof e.center.lat === "number" &&
                    !isNaN(e.center.lon) &&
                    !isNaN(e.center.lat)
            );

        setSuperchargers([
            ...parsedNodeSuperchargers,
            ...processElements(parsedWaySuperchargers),
        ]);
        setStores([...parsedNodeStores, ...processElements(parsedWayStores)]);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Geolocation success:", position.coords);
                    if (mapRef.current) {
                        mapRef.current.flyTo({
                            center: [position.coords.longitude, position.coords.latitude],
                            zoom: 14,
                            duration: 2000,
                        });
                    }
                },
                (error) => {
                    console.error("Error getting location: ", error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
        return () => {
            maplibregl.removeProtocol("pmtiles");
        };
    }, []);

    const processElements = (elements: MapElement[]) => {
        return elements.map((e) => {
            if (e.center) {
                e.lat = e.center.lat;
                e.lon = e.center.lon;
            }
            return e;
        });
    };

    return (
        <div className="Map">
            <Map
                ref={mapRef}
                initialViewState={viewport}
                onMove={(e) => setViewport(e.viewState)}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle={MapStyle}
            >
                {superchargers.map((charger) => (
                    <Marker
                        key={charger.id}
                        longitude={charger.lon === undefined ? -122.4194 : charger.lon}
                        latitude={charger.lat === undefined ? -122.4194 : charger.lat}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedMarker(charger);
                        }}
                    >
                        <img
                            src={superchargerIcon}
                            alt="Supercharger"
                            style={{ width: 25, height: 25 }}
                        />
                    </Marker>
                ))}
                {stores.map((store) => (
                    <Marker
                        key={store.id}
                        longitude={store.lon === undefined ? -122.4194 : store.lon}
                        latitude={store.lat === undefined ? -122.4194 : store.lat}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedMarker(store);
                        }}
                    >
                        <img
                            src={storeIcon}
                            alt="Store"
                            style={{ width: 25, height: 25 }}
                        />
                    </Marker>
                ))}
                {selectedMarker && (
                    <Popup
                        longitude={selectedMarker.lon === undefined ? -122.4194 : selectedMarker.lon}
                        latitude={selectedMarker.lat === undefined ? -122.4194 : selectedMarker.lat}
                        anchor="top"
                        onClose={() => setSelectedMarker(null)}
                    >
                        <div>
                            {selectedMarker.tags.amenity === "charging_station"
                                ? "Tesla Supercharger"
                                : "Target"}
                            <br />
                            {selectedMarker.tags.name || "Unnamed"}
                        </div>
                    </Popup>
                )}
                <div style={{ position: "absolute", right: 10, top: 10 }}>
                    <NavigationControl />
                </div>
            </Map>
        </div>
    );
}

export default MapView;