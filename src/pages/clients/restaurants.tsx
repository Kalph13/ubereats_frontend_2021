import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { AllRestaurantsDocument, AllRestaurantsQuery, AllRestaurantsQueryVariables } from "../../graphql/generated";
import { AllCategoriesDocument, AllCategoriesQuery, AllCategoriesQueryVariables } from "../../graphql/generated";

interface IFormProps {
    searchTerm: string;
}

export const Restaurants = () => {
    const [ page, setPage ] = useState(1);
    const onNextPageClick = () => setPage(prev => prev + 1);
    const onPrevPageClick = () => setPage(prev => prev - 1);

    const { register, handleSubmit, getValues } = useForm<IFormProps>();
    const navigate = useNavigate();

    const onSearchSubmit = () => {
        const { searchTerm } = getValues();
        navigate({
            pathname: "/search",
            search: `?term=${searchTerm}`
        })
    };

    const { data: allRestaurantsData, loading: allRestaurantsLoading } = useQuery<AllRestaurantsQuery, AllRestaurantsQueryVariables>(AllRestaurantsDocument, {
        variables: {
            allRestaurantsInput: {
                page
            }
        }
    });

    const { data: allCategoriesData, loading: allCategoriesLoading } = useQuery<AllCategoriesQuery, AllCategoriesQueryVariables>(AllCategoriesDocument);

    return (
        <div>
            <Helmet>
                <title>Home | Uber Eats</title>
            </Helmet>
            <form
                className="bg-gray-800 w-full py-40 flex items-center justify-center"
                onSubmit={handleSubmit(onSearchSubmit)}
            >
                <input
                    {...register("searchTerm", { required: true, min: 3 })}
                    type="search"
                    className="input rounded-md border-0 w-3/4 md:w-3/12"
                    placeholder="Search restaurants..."
                />
            </form>
            {(!allRestaurantsLoading && !allCategoriesLoading) && 
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="flex justify-around max-w-sm mx-auto">
                        {allCategoriesData?.allCategories.categories?.map(category => 
                            <Link key={category.id} to={`/category/${category.slug}`}>
                                <div className="flex flex-col items-center cursor-pointer">
                                    <div 
                                        className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                                        style={{ backgroundImage: `url(${category.coverImg})`}}
                                    ></div>
                                    <span className="mt-1 text-sm text-center font-medium">
                                        {category.name}
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                        {allRestaurantsData?.allRestaurants.restaurants?.map(restaurant => 
                            <Restaurant 
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                name={restaurant.name}
                                coverImg={restaurant.coverImg}
                                categoryName={restaurant.category?.name}
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-3 text-center max-w-md items-start mx-auto mt-10">
                        {page > 1 ? <button className="focus:outline-none font-medium text-2xl" onClick={onPrevPageClick}>&larr;</button> : <div></div>}
                        <span>Page {page} of {allRestaurantsData?.allRestaurants.totalPages}</span>
                        {page !== allRestaurantsData?.allRestaurants.totalPages ? <button className="focus:outline-none font-medium text-2xl" onClick={onNextPageClick}>&rarr;</button> : <div></div>}
                    </div>
                </div>
            }
        </div>
    );
};
