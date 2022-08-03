import React from "react";
import { useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { FindMeDocument, FindMeQuery } from "../graphql/generated";

export const LoggedInRouter = () => {
    const { data, loading, error } = useQuery<FindMeQuery>(FindMeDocument);

    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        )
    }

    return (
        <div>
            <h1>Logged In</h1>
            <h1>{data.findMe.id}</h1>
            <h1>{data.findMe.email}</h1>
            <h1>{data.findMe.role}</h1>
            <h1>{data.findMe.verified}</h1>
            <button onClick={() => isLoggedInVar(false)}>Log Out</button>
        </div>
    )
};
