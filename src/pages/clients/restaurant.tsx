import React from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { RestaurantDocument, RestaurantQuery, RestaurantQueryVariables } from "../../graphql/generated";

/* interface IRestaurantParams {
    id: string;
} */

export const Restaurant = () => {
    const params = useParams();
    const { data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RestaurantDocument, {
        variables: {
            restaurantInput: {
                restaurandId: params.id ? +params.id : 0
            }
        }
    });

    console.log("------ Restaurant ------ data:", data);

    return (
        <div>
            <Helmet>
                <title>{data?.restaurant.restaurant?.name || ""} | Uber Eats</title>
            </Helmet>
            <div className="bg-gray-800 bg-center bg-cover py-48" style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`}}>
                <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                <h5 className="text-sm font-light mb-2">{data?.restaurant.restaurant?.category?.name}</h5>
                <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
            </div>
        </div>
    )
};
