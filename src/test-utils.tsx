import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { render } from "@testing-library/react";

interface ITotalProviderProps {
    children: React.ReactNode;
};

const TotalProvider: React.FC<ITotalProviderProps> = ({ children }) => {
    return (
        <HelmetProvider>
            <Router>{children}</Router>
        </HelmetProvider>
    );
};

const customRender = (ui: React.ReactElement, options?: any) => render(ui, { wrapper: TotalProvider, ...options });

export * from "@testing-library/react";
export { customRender as render };
