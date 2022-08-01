import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { FormError } from "../components/form-error"

/* GraphQL Code Generator (Replaces Codegen): https://www.graphql-code-generator.com/docs/getting-started/installation */
/* GraphQL Code Generator for React: https://www.graphql-code-generator.com/docs/guides/react#apollo-and-urql */
/* - 'LoginMutation', 'LoginMutationVariables', and 'LoginDocument' are Created in 'generated.ts' from 'login.graphql' */
/* - Don't Need to Declare a 'gql' Variable → Import 'LoginDocument' Instead */
import { LoginDocument, LoginMutation, LoginMutationVariables } from "../graphql/generated";

interface ILoginForm {
    email: string;
    password: string;
    resultError?: string;
}

export const Login = () => {
    const { register, getValues, handleSubmit, formState: { errors } } = useForm<ILoginForm>();

    const onCompleted = (data: LoginMutation) => {
        const {
            login: {
                GraphQLSucceed,
                GraphQLError,
                loginToken
            }
        } = data;

        if (GraphQLSucceed) {
            console.log("------ Login ------ loginToken:", loginToken);
        }
    };

    const [ loginMutation, { data: loginMutationResult } ] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, { onCompleted });
    
    const onSubmit = () => {
        const { email, password } = getValues();

        loginMutation({
            variables: {
                loginInput: {
                    email,
                    password
                }
            }
        });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-800">
            <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
                <h3 className="text-2xl text-gray-800">Log In</h3>
                <form
                    className="grid gap-3 mt-5 px-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        className="input"
                        placeholder="Email"
                        type="email"
                        required
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email?.message && <FormError errorMessage={errors.email.message} />}
                    <input
                        className="input"
                        placeholder="Password"
                        type="password"
                        required
                        {...register("password", { required: "Password is required", minLength: 8 })}
                    />
                    {errors.password?.message && <FormError errorMessage={errors.password.message} />}
                    {errors.password?.type === "minLength" && <FormError errorMessage="Password must be longer than 8 characters" />}
                    <button className="btn mt-3">Log In</button>
                    {loginMutationResult?.login.GraphQLError && <FormError errorMessage={loginMutationResult.login.GraphQLError} />}
                </form>
            </div>
        </div>
    );
};
