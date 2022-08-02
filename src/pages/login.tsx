import React from "react";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_LOGIN_TOKEN } from "../constant";
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

        if (GraphQLSucceed && loginToken) {
            console.log("------ Login ------ loginToken:", loginToken);
            localStorage.setItem(LOCALSTORAGE_LOGIN_TOKEN, loginToken);
            authTokenVar(loginToken);
            isLoggedInVar(true);
        } else {
            console.log("------ Login ------ GraphQLError:", GraphQLError);
        }
    };

    const [
        loginMutation,
        { data: loginMutationResult, loading }
    ] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, { onCompleted });
    
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
            <Helmet>
                <title>Login | Uber Eats</title>
            </Helmet>
            <div className="w-full flex flex-col max-w-screen-sm px-5 items-center">
                <img src={Logo} alt="Logo" className="w-52 mb-10" />
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
                        {...register("email", {
                            required: "Email is required",
                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                         })}
                    />
                    {formState.errors.email?.message && <FormError errorMessage={formState.errors.email.message} />}
                    {formState.errors.email?.type === "pattern" && <FormError errorMessage="Please enter a valid email" />}
                    <input
                        className="input"
                        placeholder="Password"
                        type="password"
                        required
                        {...register("password", {
                            required: "Password is required",
                            minLength: 8
                        })}
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
