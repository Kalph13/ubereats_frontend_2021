import React from "react";

interface IDishOptionProps {
    name: string;
    extra?: number | null;
    dishId: number;
    isSelected: boolean;
    addOption: (dishId: number, optionName: string) => void;
    removeOption: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({ name, extra, dishId, isSelected, addOption, removeOption }) => {
    const onClick = () => {
        if (isSelected) removeOption(dishId, name);
        else addOption(dishId, name);
    };

    return (
        <span className={`border px-2 py-1 ${isSelected ? "border-gray-800" : "hover:border-gray-800"}`} onClick={onClick}>
            <span className="mr-2">{name}</span>
            {extra && <span className="text-sm opacity-75">(${extra})</span>}
        </span>
    )
};
