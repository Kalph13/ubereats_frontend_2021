import React, { useEffect } from "react";
import { useMutation, useApolloClient, gql } from "@apollo/client";
import { useFindMe } from "../../hooks/useFindMe";
import { VerifyEmailDocument, VerifyEmailMutation, VerifyEmailMutationVariables } from "../../graphql/generated";

export const ConfirmEmail = () => {
    const client = useApolloClient();
    const { data: userData } = useFindMe();

    const onCompleted = (data: VerifyEmailMutation) => {
        const {
            verifyEmail: {
                GraphQLSucceed
            }
        } = data;

        if (GraphQLSucceed && userData?.findMe.id) {
            client.writeFragment({
                id: `User:${userData.findMe.id}`,
                fragment: gql`
                    fragment VerifiedUser on User {
                        verified
                    }
                `,
                data: {
                    verified: true
                }
            });
        }
    };

    const [ verifyEmail ] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, { onCompleted });

    useEffect(() => {
        const [ _, code ] = window.location.href.split("code");
        console.log("------ Confirm Email ------ code:", code);
        verifyEmail({
            variables: {
                verifyEmailInput: {
                    code
                }
            }
        });
    }, []);

    return (
        <div className="mt-52 flex flex-col items-center justify-center">
            <h2 className="text-lg mb-1 font-medium">Confirming your email...</h2>
            <h4 className="text-gray-700 text-sm">Please wait, don't close this page</h4>
        </div>
    );
};
