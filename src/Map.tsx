import { useEffect, useState, useRef } from "react";
import Map, { MapRef, Marker, Popup, AttributionControl } from 'react-map-gl/maplibre';
import axios, { AxiosResponse } from 'axios';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { MapElement } from "./MapData";
import MapStyle from "./Style";
import "./styles.css";
import { MdMyLocation, MdLocationPin, MdSearch, MdOutlineHome } from "react-icons/md";
import Example from "./ScrollableSearchBar";
import useItemStore from './states';


interface ViewState {
    latitude: number;
    longitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
}

const MapView: React.FC = () => {
    const mapRef = useRef<MapRef | null>(null);
    const [superchargers, setSuperchargers] = useState<MapElement[]>([]);
    const [stores, setStores] = useState<MapElement[]>([]);
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<MapElement | null>(null);
    const item = useItemStore(state => state.item);
    const [viewport, setViewport] = useState<ViewState>({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 15,
    });

    const fetchData = async () => {
        // Assuming you have a method to get the bbox data
        const bbox = getBboxData();

        try {
            const response: AxiosResponse<MapElement[]> = await axios.post('https://maps-server.13059596.xyz/locations/' + item?.shortcut.toLowerCase(), bbox);
            const targetElements = response.data.filter(element => element.ShortName !== 'supercharger');
            const superchargerElements = response.data.filter(element => element.ShortName === 'supercharger');
            setSuperchargers(superchargerElements);
            setStores(targetElements);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const protocol = new Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);
        flyToCurrentLocation();
        return () => {
            maplibregl.removeProtocol("pmtiles");
        };
    }, []);

    const flyToCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Geolocation success:", position.coords);
                    const userLon = position.coords.longitude;
                    const userLat = position.coords.latitude;
                    setCurrentLocation([userLon, userLat]);
                    if (mapRef.current) {
                        mapRef.current.flyTo({
                            center: [userLon, userLat],
                            zoom: 15,
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
    };

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
            {/* <div className="p-2 mx-auto absolute top-5 z-10"> */}
            <Example />
            {/* <button className="absolute inset-x-32 z-10 bottom-12 p-2 rounded-md border-none bg-black/30 text-sm/6 text-white" onClick={() => fetchData()}>Search this area</button> */}
            {/* </div> */}
            <MdSearch className="absolute z-10 w-10 h-10 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none bottom-36 right-4" onClick={() => fetchData()}></MdSearch>
            <MdMyLocation className="absolute z-10 w-10 h-10 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none bottom-24 right-4" onClick={() => flyToCurrentLocation()}></MdMyLocation>
            <a href="https://chargeandchill.info"><MdOutlineHome className="absolute z-10 w-10 h-10 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none bottom-12 right-4" /></a>
            <div className="w-screen h-[calc(100dvh)]">
                <Map
                    ref={mapRef}
                    initialViewState={viewport}
                    onMove={(e) => setViewport(e.viewState)}
                    mapStyle={MapStyle}
                    attributionControl={false}
                    minZoom={7}
                >
                    <AttributionControl customAttribution='<a href="https://github.com/protomaps/basemaps">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>' compact={false} />

                    {currentLocation && (
                        <Marker
                            longitude={currentLocation[0]}
                            latitude={currentLocation[1]}
                            anchor="center"
                        >
                            <div className="relative w-5 h-5 flex items-center justify-center">
                                {/* Outer pulsing circle */}
                                <div className="absolute w-full h-full bg-blue-400 opacity-60 rounded-full animate-pulse-circle"></div>
                                {/* Inner solid circle */}
                                <div className="relative w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                            </div>

                        </Marker>
                    )}
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
                            <MdLocationPin className="w-10 h-10 text-red-500" />


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
                            <MdLocationPin className="z-10 w-10 h-10 text-black" />
                        </Marker>
                    ))}
                    {selectedMarker && (
                        <Popup
                            longitude={selectedMarker.Lon === undefined ? -122.4194 : selectedMarker.Lon}
                            latitude={selectedMarker.Lat === undefined ? -122.4194 : selectedMarker.Lat}
                            anchor="top"
                            onClose={() => setSelectedMarker(null)}
                        >
                            <div className="flex flex-col">
                                <h5 className="flex items-start font-bold">{selectedMarker.Name || selectedMarker.ShortName || "Unknown"}</h5>
                                <div className="flex items-start text-left">{selectedMarker.Address}</div>
                                <ul className="flex flex-row justify-between">
                                    <li><a className="text-blue-500 hover:underline" href={"http://maps.google.com/?q=" + selectedMarker.Name + "&ll=" + selectedMarker.Lat + "," + selectedMarker.Lon + "&z=" + 14}>Google Maps</a></li>
                                    {selectedMarker.NumberOfChargingStalls > 0 && (
                                        <li>{selectedMarker.NumberOfChargingStalls} stalls</li>
                                    )}
                                    {selectedMarker.Power > 0 && (
                                        <li>{selectedMarker.Power} kW</li>
                                    )}
                                    {selectedMarker.Website && selectedMarker.Website.trim() !== "" && (
                                        <li><a className="text-blue-500 hover:underline" href={selectedMarker.Website} target="_blank" rel="noopener noreferrer">Website</a></li>
                                    )}
                                </ul>
                            </div>
                        </Popup>
                    )}
                </Map>
            </div>
        </div>
    );
}

export default MapView;