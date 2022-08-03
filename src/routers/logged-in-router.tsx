import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "../components/header";
import { Restaurants } from "../pages/clients/restaurants";
import { NotFound } from "../pages/404";
import { useFindMe } from "../hooks/useFindMe";

const ClientRoutes = [
    <Route path="/" element={<Restaurants />} />
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
