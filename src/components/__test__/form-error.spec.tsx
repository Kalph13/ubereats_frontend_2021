import React from "react";
import { render } from "@testing-library/react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
    it("renders well with props", () => {
        const { getByText } = render(<FormError errorMessage="test" />);
        getByText("test");
    });
});
