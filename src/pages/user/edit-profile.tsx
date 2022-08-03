import React from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useFindMe } from "../../hooks/useFindMe";
import { Button } from "../../components/button";
import { EditProfileDocument, EditProfileMutation, EditProfileMutationVariables } from "../../graphql/generated";

interface IFormProps {
    email?: string;
    password?: string;
}

export const EditProfile = () => {
    const client = useApolloClient();
    const { data: userData } = useFindMe();

    const onCompleted = (data: EditProfileMutation) => {
        const {
            editProfile: {
                GraphQLSucceed
            }
        } = data;

        if (GraphQLSucceed && userData) {
            const {
                findMe: {
                    id,
                    email: prevEmail
                }
            } = userData;

            const {
                email: newEmail
            } = getValues();

            if (prevEmail !== newEmail) {
                client.writeFragment({
                    id: `User:${id}`,
                    fragment: gql`
                        fragment EditedUser on User {
                            email
                            verified
                        }
                    `,
                    data: {
                        email: newEmail,
                        verified: false
                    }
                });
            }
        };
    };

    const [ editProfile, { loading } ] = useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, { onCompleted });
    
    const { register, getValues, handleSubmit, formState } = useForm<IFormProps>({
        mode: "onChange",
        defaultValues: {
            email: userData?.findMe.email
        }
    });

    const onSubmit = () => {
        const { email, password } = getValues();

        editProfile({
            variables: {
                editProfileInput: {
                    email,
                    ...(password !== "" && { password })
                }
            }
        });
    };

    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
            <form className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5" onSubmit={onSubmit}>
                <input
                    {...register("email", { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}
                    className="input"
                    type="email"
                    placeholder="Email"
                />
                <input
                    {...register("password")}
                    className="input"
                    type="password"
                    placeholder="Password"
                />
                <Button canClick={formState.isValid} loading={loading} actionText="Save Profile" />
            </form>
        </div>
    );
};
