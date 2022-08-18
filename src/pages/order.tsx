import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useFindMe } from "../hooks/useFindMe";
import { UserRole, OrderStatus } from "../graphql/generated";
import { GetOrderDocument, GetOrderQuery, GetOrderQueryVariables } from "../graphql/generated";
import { EditOrderDocument, EditOrderMutation, EditOrderMutationVariables } from "../graphql/generated";
import { OrderUpdateDocument, OrderUpdateSubscription } from "../graphql/generated";

/* interface IParams {
    id: string;
} */

export const Order = () => {
    const params = useParams();
    const { data: userData } = useFindMe();
    
    const [ editOrder ] = useMutation<EditOrderMutation, EditOrderMutationVariables>(EditOrderDocument);

    const { data, subscribeToMore } = useQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, {
        variables: {
            getOrderInput: {
                id: params.id ? +params.id : 0
            }
        }
    });

    useEffect(() => {
        if (data?.getOrder.GraphQLSucceed) {
            subscribeToMore({
                document: OrderUpdateDocument,
                variables: {
                    orderUpdateInput: {
                        id: params.id ? +params.id : 0
                    }
                },
                updateQuery: (prev, { subscriptionData: { data } }: { subscriptionData: { data: OrderUpdateSubscription } }) => {                    
                    if (!data) {
                        return prev;
                    }
                    
                    return {
                        getOrder: {
                            ...prev.getOrder,
                            order: {
                                ...data.orderUpdate
                            }
                        }
                    }
                }
            });
        }
    }, [data]);

    const onClick = (newStatus: OrderStatus) => {
        editOrder({
            variables: {
                editOrderInput: {
                    id: params.id ? +params.id : 0,
                    status: newStatus
                }
            }
        });
    };

    return (
        <div className="container mt-32 flex justify-content">
            <Helmet>
                <title>Order #{params.id} | Uber Eats</title>
            </Helmet>
            <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-content">
                <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">Order #{params.id}</h4>
                <h5 className="p-5 pt-10 text-3xl text-center">${data?.getOrder.order?.total}</h5>
                <div className="p-5 text-xl grid gap-6">
                    <div className="border-t pt-5 border-gray-700">
                        Prepared By:{" "}
                        <span className="font-medium">{data?.getOrder.order?.restaurant?.name}</span>
                    </div>
                    <div className="border-t pt-5 border-gray-700">
                        Deliver To:{" "}
                        <span className="font-medium">{data?.getOrder.order?.customer?.email}</span>
                    </div>
                    <div className="border-t border-b by-5 border-gray-700">
                        Driver:{" "}
                        <span className="font-medium">{data?.getOrder.order?.driver?.email || "Not Yet"}</span>
                    </div>
                    {userData?.findMe.role === UserRole.Client &&
                        <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                            Status: {data?.getOrder.order?.status}
                        </span>
                    }
                    {userData?.findMe.role === UserRole.Owner &&
                        <>
                            {data?.getOrder.order?.status === OrderStatus.Pending &&
                                <button className="btn" onClick={() => onClick(OrderStatus.Cooking)}>
                                    Accept Order
                                </button>
                            }
                            {data?.getOrder.order?.status === OrderStatus.Cooking &&
                                <button className="btn" onClick={() => onClick(OrderStatus.Cooked)}>
                                    Order Cooked
                                </button>
                            }
                            {data?.getOrder.order?.status !== OrderStatus.Cooking && data?.getOrder.order?.status !== OrderStatus.Pending &&
                                <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                                    Status: {data?.getOrder.order?.status}
                                </span>
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    );
};
