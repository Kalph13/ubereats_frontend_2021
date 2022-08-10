import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { CreateRestaurantDocument, CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../graphql/generated";

interface IFromProps {
    name: string;
    address: string;
    categoryName: string;
    file: FileList;
}

export const AddRestaurant = () => {
    const [ uploading, setUploading ] = useState(false);

    const onCompleted = (data: CreateRestaurantMutation) => {
        const { 
            createRestaurant: {
                GraphQLSucceed,
                GraphQLError
            }
        } = data;

        if (GraphQLSucceed) {
            setUploading(false);
        }
    };

    const [ createRestaurant, { data } ] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(CreateRestaurantDocument, {
        onCompleted
    });
    
    const { register, getValues, handleSubmit, formState } = useForm<IFromProps>({
        mode: "onChange"
    });

    const onSubmit = async () => {
        try {
            setUploading(true);
            const { file, name, categoryName, address } = getValues();
            const actualFile = file[0];
            const formBody = new FormData();
            formBody.append("file", actualFile);
            const { url: coverImg } = await (
                await fetch("http://localhost:4000/uploads/", {
                    method: "POST",
                    body: formBody
                })
            ).json();
            createRestaurant({
                variables: {
                    createRestaurantInput: {
                        name,
                        categoryName,
                        address,
                        coverImg
                    }
                }
            });
        } catch (e) {

        }
    };

    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add Restaurant | Uber Eats</title>
            </Helmet>
            <h1 className="font-semibold text-2xl mb-3">Add Restaurant</h1>
            <form className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5" onSubmit={handleSubmit(onSubmit)}>
                <input 
                    {...register("name", { required: "Name is required "})}
                    className="input"
                    type="input"
                    placeholder="Name"
                    required
                />
                <input 
                    {...register("address", { required: "Address is required "})}
                    className="input"
                    type="input"
                    placeholder="Address"
                    required
                />
                <input 
                    {...register("categoryName", { required: "Category name is required "})}
                    className="input"
                    type="input"
                    placeholder="Category Name"
                    required
                />
                <div>
                    <input 
                        {...register("file", { required: true })}
                        type="file"
                        accept="image/"
                    />
                </div>
                <Button
                    loading={uploading}
                    canClick={formState.isValid}
                    actionText="Create Restaurant"
                />
                {data?.createRestaurant?.GraphQLError && <FormError errorMessage={data.createRestaurant.GraphQLError} />}
            </form>
        </div>
    );
};
