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

const ClientRoutes = [
    <Route key={1} path="/" element={<Restaurants />} />,
    <Route key={2} path="/confirm-email" element={<ConfirmEmail />} />,
    <Route key={3} path="/edit-profile" element={<EditProfile />} />,
    <Route key={4} path="/search" element={<Search />} />,
    <Route key={5} path="/category/:slug" element={<Category />} />,
    <Route key={6} path="/restaurant/:id" element={<Restaurant/>} />
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
                {data.findMe.role === "Client" && ClientRoutes}
                <Route path="/" element={<Navigate replace to="/" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
};
