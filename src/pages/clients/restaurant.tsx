import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { RestaurantDocument, RestaurantQuery, RestaurantQueryVariables} from "../../graphql/generated";
import { CreateOrderDocument, CreateOrderMutation, CreateOrderMutationVariables} from "../../graphql/generated";
import { CreateOrderItemInput } from "../../graphql/generated";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";

/* interface IRestaurantParams {
    id: string;
} */

export const Restaurant = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [ orderStarted, setOrderStarted ] = useState(false);
    const [ orderItems, setOrderItems ] = useState<CreateOrderItemInput[]>([]);
    console.log("------ Restaurant ------ orderItems:", orderItems);

    const getItem = (dishId: number) => {
        return orderItems.find(order => order.dishId === dishId);
    };

    const getOption = (item: CreateOrderItemInput, optionName: string) => {
        return item.options?.find(option => option.name === optionName)
    };

    const isSelected = (dishId: number) => {
        return Boolean(getItem(dishId));
    };

    const isOptionSelected = (dishId: number, optionName: string) => {
        const item = getItem(dishId);

        if (item) {
            return Boolean(getOption(item, optionName));
        }

        return false;
    }

    const startOrder = () => {
        setOrderStarted(true);
    };

    const cancelOrder = () => {
        setOrderStarted(false);
        setOrderItems([]);
    };

    const confirmOrder = () => {
        if (orderItems.length === 0) {
            alert("Can't place an empty order");
            return;
        }

        const isReady = window.confirm("You're about to place an order");

        if (isReady) {
            createOrder({
                variables: {
                    createOrderInput: {
                        restaurantId: params.id ? +params.id : 0,
                        items: orderItems
                    }
                }
            });
        }
    };

    const addItem = (dishId: number) => {
        if (isSelected(dishId)) {
            return;
        }
        
        setOrderItems(prev => [{ dishId, options: [] }, ...prev]);
    };

    const removeItem = (dishId: number) => {
        setOrderItems(prev => prev.filter(dish => dish.dishId !== dishId));
    };

    const addOption = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) {
            return;
        }

        const oldItem = getItem(dishId);

        if (oldItem) {
            const hasOption = Boolean(getOption(oldItem, optionName));
            
            if (!hasOption) {
                removeItem(dishId);
                setOrderItems(prev => [
                    { dishId, options: [{ name: optionName, choice: "" }, ...oldItem.options! ]},
                    ...prev
                ]);
            }
        }
    };

    const removeOption = (dishId: number, optionName: string) => {
        if(!isSelected(dishId)) {
            return;
        }

        const oldItem = getItem(dishId);

        if (oldItem) {
            removeItem(dishId);
            setOrderItems(prev => [
                { dishId, options: oldItem.options?.filter(option => option.name !== optionName) },
                ...prev
            ]);
            return;
        }
    }

    const onCompleted = (data: CreateOrderMutation) => {
        const {
            createOrder: {
                GraphQLSucceed,
                orderId
            }
        } = data;

        if (GraphQLSucceed) {
            navigate(`/orders/${orderId}`);
        }
    };

    const { data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RestaurantDocument, {
        variables: {
            restaurantInput: {
                restaurandId: params.id ? +params.id : 0
            }
        }
    });

    const [ createOrder, { loading: loadingOrder }] = useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, {
        onCompleted
    });

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
                {!orderStarted && <button className="btn px-10" onClick={startOrder}>Start Order</button>}
                {orderStarted &&
                    <div className="flex items-center">
                        <button className="btn px-10 mr-3" onClick={confirmOrder}>Confirm Order</button>
                        <button className="btn px-10 bg-black hover:bg-black" onClick={cancelOrder}>Cancel Order</button>
                    </div>
                }
                <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.restaurant.restaurant?.menu.map((dish, index) =>
                        <Dish
                            key={index}
                            id={dish.id}
                            name={dish.name}
                            price={dish.price}
                            description={dish.description}
                            options={dish.options}
                            isSelected={isSelected(dish.id)}
                            isCustomer={true}
                            orderStarted={orderStarted}
                            addItem={addItem}
                            removeItem={removeItem}
                        >
                            {dish.options?.map((option, index) => 
                                <DishOption 
                                    key={index}
                                    name={option.name}
                                    extra={option.extra}
                                    dishId={dish.id}
                                    isSelected={isOptionSelected(dish.id, option.name)}
                                    addOption={addOption}
                                    removeOption={removeOption}
                                />
                            )}
                        </Dish>
                    )}
                </div>
            </div>
        </div>
    )
};
