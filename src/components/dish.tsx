import React from "react";
import { DishOption } from "../graphql/generated";

interface IDishProps {
    id?: number;
    name: string;
    price: number;
    description: string;
    isCustomer?: boolean;
    isSelected?: boolean;
    orderStarted?: boolean;
    options?: DishOption[] | null;
    children?: React.ReactNode,
    addItem: (dishId: number) => void;
    removeItem: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
    id = 0,
    name,
    price,
    description,
    isCustomer = false,
    isSelected,
    orderStarted = false,
    options,
    children: dishOptions,
    addItem,
    removeItem,
}) => {
    const onClick = () => {
        if (orderStarted) {
            if (!isSelected && addItem) {
                return addItem(id);
            }

            if (isSelected && removeItem) {
                return removeItem(id);
            }
        }
    };
    
    return (
        <div className={`px-8 py-4 border cursor-pointer transition-all ${isSelected ? "border-gray-800" : "hover:border-gray-800"}`}>
            <div className="mb-5">
                <h3 className="text-lg font-medium flex items-center">
                    {name}
                    {orderStarted &&
                        <button 
                            className={`ml-3 py-1 focus:outline-none text-sm text-white ${isSelected ? "bg-red-500" : "bg-lime-600"}`} 
                            onClick={onClick}
                        >
                            {isSelected ? "Remove" : "Add"}
                        </button>
                    }
                </h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>${price}</span>
            {isCustomer && options && options?.length !== 0 && 
                <div>
                    <h5 className="mt-8 mb-3 font-medium">Dish Options</h5>
                    <div className="grid gap-2 justify-start">{dishOptions}</div>
                </div>
            }
        </div>
    );
};
