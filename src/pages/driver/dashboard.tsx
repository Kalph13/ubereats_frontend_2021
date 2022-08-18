import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords { 
    lat: number;
    lng: number;
}

interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-3xl">🚖</div>;

export const Dashboard = () => {
    const [ driverCoords, setDriverCoords ] = useState<ICoords>({ lat: 0, lng: 0 });
    const [ map, setMap ] = useState<google.maps.Map>();
    const [ maps, setMaps ] = useState<any>();

    // @ts-ignore
    const onSuccess = ({ coords: { latitude, longitude } }) => {
        setDriverCoords({ lat: latitude, lng: longitude });
    };

    // @ts-ignore
    const onError = (error) => {
        console.log(error);
    }

    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    };

    const onGetRouteClick = () => {
        if (map) {
            const directionService = new google.maps.DirectionsService();
            const directionRenderer = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "#000",
                    strokeOpacity: 1,
                    strokeWeight: 58
                }
            });
            directionRenderer.setMap(map);
            directionService.route(
                {
                    origin: { location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng) },
                    destination: { location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lng + 0.05) },
                    travelMode: google.maps.TravelMode.DRIVING
                },
                result => {
                    directionRenderer.setDirections(result);
                }
            );
        }
    };

    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true
        });
    }, []);

    useEffect(() => {
        if (map && maps) {
            map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
        }
    }, [driverCoords.lat, driverCoords.lng])

    /* How to Get a Bootstrap URL Key: https://developers.google.com/maps/documentation/javascript/get-api-key */
    return (
        <div>
            <div className="overflow-hidden" style={{ width: window.innerWidth, height: "50vh" }}>
                <GoogleMapReact
                    defaultCenter={{
                        lat: 36.58,
                        lng: 125.95
                    }}
                    defaultZoom={16}
                    draggable={true}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={onApiLoaded}
                    bootstrapURLKeys={{ key: `${process.env.REACT_APP_BOOTSTRAP_URL_KEYS}` }}
                >
                    <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
                </GoogleMapReact>
            </div>
            <button onClick={onGetRouteClick}>Get Route</button>
        </div>
    );
};
