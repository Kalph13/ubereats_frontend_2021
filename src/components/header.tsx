import React from "react";
import { Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFindMe } from "../hooks/useFindMe";
import Logo from "../images/logo.svg";

export const Header = () => {
    const { data } = useFindMe();

    console.log("------ Header ------ data:", data);

    return (
        <>
            {!data?.findMe.verified &&
                <div className="bg-red-500 p-3 text-center text-base text-white">
                    <span>Please verify your email</span>
                </div>
            }
            <header className="py-4">
                <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-center items-center">
                    <Link to="/">
                            <img src={Logo} alt="Logo" className="w-44" />
                    </Link>
                    <span className="text-xs">
                        <Link to="/edit-profile">
                            <FontAwesomeIcon icon={faUser} className="text-2xl" />
                        </Link>
                    </span>
                </div>
            </header>
        </>
    );
};
