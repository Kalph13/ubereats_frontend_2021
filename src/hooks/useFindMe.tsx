import { useQuery } from "@apollo/client";
import { FindMeDocument, FindMeQuery } from "../graphql/generated";

export const useFindMe = () => {
    return useQuery<FindMeQuery>(FindMeDocument);
};
