import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLazyQuery } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchRestaurantDocument, SearchRestaurantQuery, SearchRestaurantQueryVariables } from "../../graphql/generated";

export const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [ searchRestaurant, { data, loading, called }] = useLazyQuery<SearchRestaurantQuery, SearchRestaurantQueryVariables>(SearchRestaurantDocument);

    useEffect(() => {
        // eslint-disable-next-line
        const [ _, query ] = location.search.split("?term=");

        if (!query) {
            return navigate("/");
        }
        
        searchRestaurant({
            variables: {
                searchRestaurantInput: {
                    page: 1,
                    query
                }
            }
        })
    }, [navigate, location]);

    return (
        <div>
            <Helmet>
                <title>Search | Uber Eats</title>
            </Helmet>
            <h1>Search Page</h1>
        </div>
    );
};
