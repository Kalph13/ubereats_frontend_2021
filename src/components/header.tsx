import React from "react";
import { Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFindMe } from "../hooks/useFindMe";
import Logo from "../images/logo.svg";

export const Header = () => {
    const { data } = useFindMe();

    return (
        <header className="py-4">
            <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-center items-center">
                <img src={Logo} alt="Logo" className="w-24" />
                <span className="text-xs">
                    <Link to="/my-profile">
                        <FontAwesomeIcon icon={faUser} className="text-xl" />
                    </Link>
                </span>
            </div>
        </header>
    );
};
