import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { RestaurantDocument, RestaurantQuery, RestaurantQueryVariables, CreateOrderItemInput } from "../../graphql/generated";
import { Dish } from "../../components/dish";

/* interface IRestaurantParams {
    id: string;
} */

export const Restaurant = () => {
    const params = useParams();
    const [ orderStarted, setOrderStarted ] = useState(false);
    const [ orderItems, setOrderItems ] = useState<CreateOrderItemInput[]>([]);

    const startOrder = () => {
        setOrderStarted(true);
    };

    const addItemToOrder = (dishId: number) => {
        setOrderItems(prev => [{ dishId }, ...prev]);
        console.log("------ Restaurant ------ orderItems:", orderItems);
    };

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
            <div className="container pb-32 flex flex-col items-end mt-20">
                <button className="btn px-10" onClick={startOrder}>
                    Start Order
                </button>
                <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.restaurant.restaurant?.menu.map((dish, index) =>
                        <Dish
                            key={index}
                            id={dish.id}
                            name={dish.name}
                            price={dish.price}
                            description={dish.description}
                            options={dish.options}
                            isCustomer={true}
                            orderStarted={orderStarted}
                            addItemToOrder={addItemToOrder}
                        />
                    )}
                </div>
            </div>
        </div>
    )
};
