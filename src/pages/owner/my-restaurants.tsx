import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { MyRestaurantsDocument, MyRestaurantsQuery } from "../../graphql/generated";

export const MyRestaurants = () => {
    const { data } = useQuery<MyRestaurantsQuery>(MyRestaurantsDocument);
    console.log("------ My Restaurant ------ data:", data);

    return (
        <div>
            <Helmet>
                <title>My Restaurant | Uber Eats</title>
            </Helmet>
            <div className="max-w-screen-2xl mx-auto mt-32">
                <h2 className="text-4xl font-medium mb-10">My Restaurant</h2>
                {data?.myRestaurants.GraphQLSucceed && data.myRestaurants.restaurants.length === 0 && 
                    <>
                        <h4 className="text-xl mb-5">You have no resturants</h4>
                        <Link 
                            className="text-lime-600 hover:underline"
                            to="add-restaurant"
                        >
                            Create One &rarr;
                        </Link>
                    </>
                }
            </div>
        </div>
    );
};
