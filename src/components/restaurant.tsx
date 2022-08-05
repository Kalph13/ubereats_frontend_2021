import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
    id: string;
    name: string;
    coverImg: string;
    categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ id, name, coverImg, categoryName }) => {
    return (
        <Link to={`/restaurant/${id}`}>
            <div className="flex flex-col">
                <div className="bg-color bg-center mb-3 py-28" style={{ backgroundImage: `url(${coverImg})` }} />
                <h3 className="text-xl">{name}</h3>
                <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">{categoryName}</span>
            </div>
        </Link>
    );
}
