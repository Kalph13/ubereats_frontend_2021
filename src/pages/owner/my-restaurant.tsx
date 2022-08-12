import React from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { useFindMe } from "../../hooks/useFindMe";
import { Dish } from "../../components/dish";
import { MyRestaurantDocument, MyRestaurantQuery, MyRestaurantQueryVariables } from "../../graphql/generated";
import { CreatePaymentDocument, CreatePaymentMutation, CreatePaymentMutationVariables } from "../../graphql/generated";

/* interface IParams {
    id: string;
} */

export const MyRestaurant = () => {
    const params = useParams();
    const { data: userData } = useFindMe();
    
    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MyRestaurantDocument, {
        variables: {
            myRestaurantInput: {
                id: params.id ? +params.id : 0
            }
        }
    });

    const paddleTrigger = () => {
        if (userData?.findMe.email) {
            // @ts-ignore
            window.Paddle.Environment.set('sandbox');
            // @ts-ignore
            window.Paddle.Setup({ vendor: 7619 });
            // @ts-ignore
            window.Paddle.Checkout.open({
                product: 33437,
                email: userData.findMe.email,
                successCallback: (data: any) => {
                    createPayment({
                        variables: {
                            createPaymentInput: {
                                transactionId: data.checkout.id,
                                restaurantId: params.id ? +params.id : 0
                            }
                        }
                    })
                }
            });
        }
    };

    const onCompleted = (data: CreatePaymentMutation) => {
        if (data.createPayment.GraphQLSucceed) {
            alert("Your restaurant is being promoted!");
        }
    };

    const [ createPayment, { loading } ] = useMutation<CreatePaymentMutation, CreatePaymentMutationVariables>(CreatePaymentDocument, {
        onCompleted
    })

    return (
        <div>
            <Helmet>
                <title>{data?.myRestaurant.restaurant?.name || "Loading..."} | Uber Eats</title>
                <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
            </Helmet>
            <div className="checkout-container" />
            <div className="bg-gray-700 py-28 bg-center bg-cover" style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }} />
            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${params.id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
                    Add Dish &rarr;
                </Link>
                <span className="cursor-pointer text-white bg-lime-700 py-3 px-10" onClick={paddleTrigger}>
                    Buy Promotion &rarr;
                </span>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu.length === 0 ? 
                        <h4 className="text-xl mb-5">Please upload a dish!</h4> : 
                        <div>
                            {data?.myRestaurant.restaurant?.menu.map((dish, index) => <Dish key={index} name={dish.name} price={dish.price} description={dish.description} />)}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
};
