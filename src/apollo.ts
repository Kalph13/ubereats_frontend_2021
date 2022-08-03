import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_LOGIN_TOKEN } from "./constant";

const loginToken = localStorage.getItem(LOCALSTORAGE_LOGIN_TOKEN);
export const isLoggedInVar = makeVar(Boolean(loginToken));
export const authTokenVar = makeVar(loginToken);

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql"
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            "x-jwt": authTokenVar() || ""
        }
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read() {
                            return isLoggedInVar();
                        }
                    },
                    loginToken: {
                        read() {
                            return authTokenVar();
                        }
                    }
                }
            }
        }    
    })
});
