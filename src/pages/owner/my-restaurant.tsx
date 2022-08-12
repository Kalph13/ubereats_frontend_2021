import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { MyRestaurantDocument, MyRestaurantQuery, MyRestaurantQueryVariables } from "../../graphql/generated";
import { Dish } from "../../components/dish";

/* interface IParams {
    id: string;
} */

export const MyRestaurant = () => {
    const params = useParams();
    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MyRestaurantDocument, {
        variables: {
            myRestaurantInput: {
                id: params.id ? +params.id : 0
            }
        }
    });

    return (
        <div>
            <Helmet>
                <title>{data?.myRestaurant.restaurant?.name || "Loading..."} | Uber Eats</title>
            </Helmet>
            <div className="bg-gray-700 py-28 bg-center bg-cover" style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }} />
            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${params.id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
                    Buy Promotion &rarr;
                </Link>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu.length === 0 ? 
                        <h4 className="text-xl mb-5">Please upload a dish!</h4> : 
                        <div>
                            {data?.myRestaurant.restaurant?.menu.map(dish => <Dish name={dish.name} price={dish.price} description={dish.description} />)}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
};
