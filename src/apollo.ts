import { ApolloClient, InMemoryCache, makeVar, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_LOGIN_TOKEN } from "./constant";

/* Subscription w/graphql-ws: https://www.apollographql.com/docs/react/api/link/apollo-link-subscriptions */
/* - Doc: https://www.npmjs.com/package/graphql-ws */
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

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

/* Subscription: https://www.apollographql.com/docs/react/data/subscriptions */
/* Options For createClient: https://github.com/enisdenjo/graphql-ws/blob/master/docs/interfaces/client.ClientOptions.md */
const wsLink = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:4000/graphql",
        connectionParams: {
            "x-jwt": authTokenVar() || ""
        }
    })
);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    authLink.concat(httpLink)
);

export const client = new ApolloClient({
    link: splitLink,
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
