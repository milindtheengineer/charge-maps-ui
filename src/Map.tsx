import { useEffect, useState, useRef } from "react";
import Map, { MapRef, NavigationControl, Marker, Popup } from 'react-map-gl/maplibre';
import axios, { AxiosResponse } from 'axios';
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

    const fetchData = async () => {
        // Assuming you have a method to get the bbox data
        const bbox = getBboxData();

        try {
            const response: AxiosResponse<MapElement[]> = await axios.post('https://maps-server.13059596.xyz/locations', bbox);

            const targetElements = response.data.filter(element => element.Name === 'target');
            const superchargerElements = response.data.filter(element => element.Name === 'supercharger');
            setSuperchargers(superchargerElements);
            setStores(targetElements);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const protocol = new Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);
        // Parse the data from your JSON file
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Geolocation success:", position.coords);
                    if (mapRef.current) {
                        const map = mapRef.current.getMap();
                        const onMoveEnd = () => {
                            map.off('moveend', onMoveEnd); // Remove listener after it's called
                            fetchData();
                        };

                        map.on('moveend', onMoveEnd); // Attach moveend event listener
                        mapRef.current.flyTo({
                            center: [position.coords.longitude, position.coords.latitude],
                            zoom: 10,
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

    const getBboxData = () => {
        if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            const bbox = {
                MinLat: bounds.getSouthWest().lat.toString(),
                MaxLat: bounds.getNorthEast().lat.toString(),
                MinLon: bounds.getSouthWest().lng.toString(),
                MaxLon: bounds.getNorthEast().lng.toString(),
            };
            console.log("Current Bbox:", bbox);
            return bbox;
        }
        return null;
    };


    return (
        <div className="Map">
            <button onClick={() => fetchData()}>Search this area</button>
            <Map
                ref={mapRef}
                initialViewState={viewport}
                onMove={(e) => setViewport(e.viewState)}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle={MapStyle}
            // onMoveEnd={() => fetchData()}
            >
                {superchargers.map((charger) => (
                    <Marker
                        key={`${charger.Name}-${charger.Lat}-${charger.Lon}`}
                        longitude={charger.Lon === undefined ? -122.4194 : charger.Lon}
                        latitude={charger.Lat === undefined ? -122.4194 : charger.Lat}
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
                        key={`${store.Name}-${store.Lat}-${store.Lon}`}
                        longitude={store.Lon === undefined ? -122.4194 : store.Lon}
                        latitude={store.Lat === undefined ? -122.4194 : store.Lat}
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
                        longitude={selectedMarker.Lon === undefined ? -122.4194 : selectedMarker.Lon}
                        latitude={selectedMarker.Lat === undefined ? -122.4194 : selectedMarker.Lat}
                        anchor="top"
                        onClose={() => setSelectedMarker(null)}
                    >
                        <div>
                            {selectedMarker.Name}
                            <br />
                            {selectedMarker.Name || "Unnamed"}
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