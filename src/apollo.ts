import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { LOCALSTORAGE_LOGIN_TOKEN } from "./constant";

const loginToken = localStorage.getItem(LOCALSTORAGE_LOGIN_TOKEN);
export const isLoggedInVar = makeVar(Boolean(loginToken));
export const authTokenVar = makeVar(loginToken);

console.log("------ Apollo Client ------ isLoggedInVar:", isLoggedInVar);
console.log("------ Apollo Client ------ authTokenVar:", authTokenVar);

export const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
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
