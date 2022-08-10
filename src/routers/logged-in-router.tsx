import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useFindMe } from "../hooks/useFindMe";
import { Header } from "../components/header";
import { Restaurants } from "../pages/clients/restaurants";
import { Search } from "../pages/clients/search";
import { Category } from "../pages/clients/category";
import { Restaurant } from "../pages/clients/restaurant";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { MyRestaurants } from "../pages/owner/my-restaurants";

const clientRoutes = [
    { path: "/", element: <Restaurants /> },
    { path: "/confirm-email", element: <ConfirmEmail /> },
    { path: "/edit-profile", element: <EditProfile /> },
    { path: "/search", element: <Search /> },
    { path: "/category/:slug", element: <Category /> },
    { path: "/restaurant/:id", element: <Restaurant/> }
];

const ownerRoutes = [
    { path: "/", element: <MyRestaurants /> }
];

export const LoggedInRouter = () => {
    const { data, loading, error } = useFindMe();

    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        )
    }

    /* Navigate (Replaces Redirect): https://devalice.tistory.com/112 */
    return (
        <Router>
            <Header />
            <Routes>
                {data.findMe.role === "Client" && clientRoutes.map(route => <Route key={route.path} path={route.path} element={route.element} />)}
                {data.findMe.role === "Owner" && ownerRoutes.map(route => <Route key={route.path} path={route.path} element={route.element} />)}
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
};
