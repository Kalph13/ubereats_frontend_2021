import React, { useState } from "react";
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
    [key: string]: string;
}

export const AddDish = () => { 
    const params = useParams();
    const navigate = useNavigate();
    const [ optionIndex, setOptionIndex ] = useState<number[]>([]);

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

    const { register, setValue, getValues, handleSubmit, formState} = useForm({
        mode: "onChange"
    });

    const onSubmit = () => {
        const { name, price, description, ...rest } = getValues();

        const optionObject = optionIndex.map(index => ({
            name: rest[`${index}-optionName`],
            extra: +rest[`${index}-optionExtra`]
        }));

        createDish({
            variables: {
                createDishInput: {
                    name,
                    price: +price,
                    description,
                    restaurantId: params.restaurantId ? +params.restaurantId : 0,
                    options: optionObject
                }
            }
        });

        navigate(-1);
    };

    const onOptionClick = () => {
        setOptionIndex(prev => [Date.now(), ...prev]);
    };

    const onDeleteClick = (deleteIndex: number) => {
        setOptionIndex(prev => prev.filter(index => index !== deleteIndex));
        // @ts-ignore
        setValue(`${deleteIndex}-optionName`, "");
        // @ts-ignore
        setValue(`${deleteIndex}-optionExtra`, "");
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
                <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
                    <span className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5" onClick={onOptionClick}>
                        Add Dish Option
                    </span>
                    {optionIndex.length !== 0 && optionIndex.map(index => (
                        <div key={index} className="mt-5">
                            <input 
                                {...register(`${index}-optionName`)}
                                className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                                type="text"
                                placeholder="Option Name"
                            />
                            <input 
                                {...register(`${index}-optionExtra`)}
                                className="py-2 px-4 ocus:outline-none focus:border-gray-600 border-2"
                                type="number"
                                min={0}
                                placeholder="Option Extra"
                            />
                            <span onClick={() => onDeleteClick(index)}>
                                Delete Option
                            </span>
                        </div>
                    ))}
                </div>
                <Button 
                    loading={loading}
                    canClick={formState.isValid}
                    actionText="Create Dish"
                />
            </form>
        </div>
    );
};
