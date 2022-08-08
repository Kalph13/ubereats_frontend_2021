import React from "react";

interface IFormErrorProps {
    testId?: string;
    errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ testId, errorMessage }) => {
    return <span role="alert" data-testid={testId} className="font-medium text-red-500">{errorMessage}</span>
};
