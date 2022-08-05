import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { CategoryDocument, CategoryQuery, CategoryQueryVariables } from "../../graphql/generated";

interface ICategoryParams {
    slug: string;
}

export const Category = () => {
    const params = useParams();
    const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, {
        variables: {
            categoryInput: {
                page: 1,
                slug: params.slug ? params.slug : ""
            }
        }
    })

    console.log("------ Category ------ data:", data);

    return <h1>Category</h1>;
};
