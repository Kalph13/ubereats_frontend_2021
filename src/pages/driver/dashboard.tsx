import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useSubscription } from "@apollo/client";
import { CookedOrdersDocument, CookedOrdersSubscription } from "../../graphql/generated"
import { TakeOrderDocument, TakeOrderMutation, TakeOrderMutationVariables } from "../../graphql/generated"

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
    const navigate = useNavigate();

    // @ts-ignore
    const onSuccess = ({ coords: { latitude, longitude } }) => {
        setDriverCoords({ lat: latitude, lng: longitude });
    };

    // @ts-ignore
    const onError = (error) => {
        console.log("------ onError ------", error);
    }

    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
        setMap(map);
        setMaps(maps);
    };

    const onCompleted = (data: TakeOrderMutation) => {
        if (data.takeOrder.GraphQLSucceed) {
            navigate(`/order/${cookedOrdersData?.cookedOrders.id}`);
        }
    };

    const onClick = (orderId: number) => {
        takeOrder({
            variables: {
                takeOrderInput: {
                    id: orderId
                }
            }
        });
    };

    const makeRoute = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "#000",
                    strokeOpacity: 1,
                    strokeWeight: 5
                }
            });
            directionsRenderer.setMap(map);
            directionsService.route(
                {
                    origin: { location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng) },
                    destination: { location: new google.maps.LatLng(driverCoords.lat - 0.05, driverCoords.lng + 0.05) },
                    travelMode: google.maps.TravelMode.TRANSIT
                },
                (result) => {
                    directionsRenderer.setDirections(result);
                }
            );
        }
    };

    const { data: cookedOrdersData } = useSubscription<CookedOrdersSubscription>(CookedOrdersDocument);

    const [ takeOrder ] = useMutation<TakeOrderMutation, TakeOrderMutationVariables>(TakeOrderDocument, {
        onCompleted
    })

    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true
        });
    }, []);

    useEffect(() => {
        if (map && maps) {
            map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                {
                    location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
                },
                (results, status) => {
                    console.log("------ Geocode ------- status, results:", status, results);
                }
            );
        }
    }, [driverCoords.lat, driverCoords.lng])

    useEffect(() => {
        if (cookedOrdersData?.cookedOrders.id) {
            makeRoute();
        }
    }, [cookedOrdersData]);

    /* How to Get a Bootstrap URL Key: https://developers.google.com/maps/documentation/javascript/get-api-key */
    return (
        <div>
            <div className="overflow-hidden" style={{ width: window.innerWidth, height: "50vh" }}>
                <GoogleMapReact
                    defaultCenter={{
                        lat: 0,
                        lng: 0
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
            <div className="max-w-screen-sm mx-auto bg-white relative top-10 shadow-lg py-8 px-5">
                    {cookedOrdersData?.cookedOrders.restaurant ? (
                        <>
                            <h1 className="text-center text-3xl font-medium">
                                New Cooked Order
                            </h1>
                            <h1 className="text-center my-3 text-2xl font-medium">
                                Pick it up soon @{" "}
                                {cookedOrdersData.cookedOrders.restaurant.name}
                            </h1>
                            <button className="btn w-full block text-center mt-5" onClick={() => onClick(cookedOrdersData.cookedOrders.id)}>
                                Accept Challenge &rarr;
                            </button>
                        </> 
                    ) : (
                        <h1 className="text-center text-3xl font-medium">
                            No orders yet...
                        </h1>
                    )}
            </div>
        </div>
    );
};
