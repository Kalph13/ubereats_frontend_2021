import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import Logo from "../images/logo.svg";

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
    const { register, getValues, handleSubmit, formState } = useForm<ILoginForm>({
        mode: "onChange"
    });

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
        } else {
            console.log("------ Login ------ GraphQLError:", GraphQLError);
        }
    };

    const [ loginMutation, { data: loginMutationResult, loading } ] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, { onCompleted });
    
    const onSubmit = () => {
        if (!loading) {
            const { email, password } = getValues();

            loginMutation({
                variables: {
                    loginInput: {
                        email,
                        password
                    }
                }
            });
        }
    };

    return (
        <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
            <div className="w-full flex flex-col max-w-screen-sm px-5 items-center">
                <img src={Logo} className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">Welcome Back</h4>
                <form
                    className="grid gap-3 mt-5 w-full mb-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        className="input"
                        placeholder="Email"
                        type="email"
                        required
                        {...register("email", { required: "Email is required" })}
                    />
                    {formState.errors.email?.message && <FormError errorMessage={formState.errors.email.message} />}
                    <input
                        className="input"
                        placeholder="Password"
                        type="password"
                        required
                        {...register("password", { required: "Password is required", minLength: 8 })}
                    />
                    {formState.errors.password?.message && <FormError errorMessage={formState.errors.password.message} />}
                    {formState.errors.password?.type === "minLength" && <FormError errorMessage="Password must be longer than 8 characters" />}
                    <Button canClick={formState.isValid} loading={loading} actionText={"Log In"} />
                    {loginMutationResult?.login.GraphQLError && <FormError errorMessage={loginMutationResult.login.GraphQLError} />}
                </form>
                <div>
                    New to Uber?{" "}
                    <Link to="/create-account" className="text-lime-600 hover:underline">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
};
