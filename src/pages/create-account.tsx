import React from "react";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { CreateAccountDocument, CreateAccountMutation, CreateAccountMutationVariables, UserRole } from "../graphql/generated";
import Logo from "../images/logo.svg";

interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;
}

export const CreateAccount = () => {
    const { register, getValues, handleSubmit, formState} = useForm<ICreateAccountForm>({
        mode: "onChange",
        defaultValues: {
            role: UserRole.Client
        }
    });

    /* useNavigate (Replaces useHistory): https://blog.woolta.com/categories/1/posts/211 */
    const navigate = useNavigate();

    const onCompleted = (data: CreateAccountMutation) => {
        const {
            createAccount: {
                GraphQLSucceed
            }
        } = data;

        if (GraphQLSucceed) {
            alert("Your account is successfully created! Log in and enjoy Uber Eats")
            navigate("/");
        }
    };

    const [
        createAccountMutation,
        { loading, data: createAccountMutationResult }
    ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, { onCompleted });

    const onSubmit = () => {
        if (!loading) {
            const { email, password, role } = getValues();
            
            createAccountMutation({
                variables: {
                    createAccountInput: { email, password, role }
                }
            });
        }
    };
    
    return (
        <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
            <Helmet>
                <title>Create Account | Uber Eats</title>
            </Helmet>
            <div className="w-full flex flex-col items-center max-w-screen-sm px-5">
                <img src={Logo} alt="Logo" className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">
                    Let's get started
                </h4>
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3 mt-5 w-full mb-5"
                >
                    <input 
                        {...register("email", {
                            required: "Email is required",
                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })}
                        className="input"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    {formState.errors.email?.message && <FormError testId="email_required" errorMessage={formState.errors.email.message} />}
                    {formState.errors.email?.type === "pattern" && <FormError testId="email_invalid" errorMessage="Please enter a valid email" />}
                    <input 
                        {...register("password", {
                            required: "Password is required",
                            minLength: 8
                        })}
                        className="input"
                        type="password"
                        placeholder="Password"
                        required
                    />
                    {formState.errors.password?.message && <FormError testId="password_required" errorMessage={formState.errors.password.message} />}
                    {formState.errors.password?.type === "minLength" && <FormError testId="password_invalid" errorMessage={"Password must be longer than 8 characters"} />}
                    <select
                        {...register("role", { required: true })}
                        className="input"
                    >
                        {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
                    </select>
                    <Button 
                        canClick={formState.isValid}
                        loading={loading}
                        actionText={"Create Account"}
                    />
                    {createAccountMutationResult?.createAccount.GraphQLError && <FormError errorMessage={createAccountMutationResult.createAccount.GraphQLError} />}
                </form>
                <div>
                    Already have an account?{" "}
                    <Link to="/" className="text-lime-600 hover:underline">
                        Log in now
                    </Link>
                </div>
            </div>
        </div>
    );
};
