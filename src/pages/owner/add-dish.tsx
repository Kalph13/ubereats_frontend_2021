import React from "react";
import { Helmet } from "react-helmet";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { CreateDishDocument, CreateDishMutation, CreateDishMutationVariables, MyRestaurantDocument } from "../../graphql/generated";

interface IParams {
    restaurantId: string;
}

interface IFormParams {
    name: string;
    price: string;
    description: string;
}

export const AddDish = () => { 
    const params = useParams();
    const navigage = useNavigate();

    const [ createDish, { loading } ] = useMutation<CreateDishMutation, CreateDishMutationVariables>(CreateDishDocument, {
        refetchQueries: [
            {
                query: MyRestaurantDocument,
                variables: {
                    myRestaurantInput: {
                        id: params.restaurantId ? +params.restaurantId : 0
                    }
                }
            }
        ]
    });

    const { register, getValues, handleSubmit, formState} = useForm<IFormParams>({
        mode: "onChange"
    });

    const onSubmit = () => {
        const { name, price, description } = getValues();

        createDish({
            variables: {
                createDishInput: {
                    name,
                    price: +price,
                    description,
                    restaurantId: params.restaurantId ? +params.restaurantId : 0
                }
            }
        })

        navigage(-1);
    };

    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add Dish | Uber Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input 
                    {...register("name", { required: "Name is required" })}
                    className="input"
                    type="text"
                    placeholder="Name"
                />
                <input 
                    {...register("price", { required: "Price is required" })}
                    className="input"
                    type="number"
                    min={0}
                    placeholder="Price"
                />
                <input 
                    {...register("description", { required: "Description is required" })}
                    className="input"
                    type="text"
                    placeholder="Description"
                />
                <Button 
                    loading={loading}
                    canClick={formState.isValid}
                    actionText="Create Dish"
                />
            </form>
        </div>
    );
};
