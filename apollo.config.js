module.exports = {
    client: {
        includes: ["./src/**/*.{tsx,ts}"],
        tagName: "gql",
        service: {
            name: "ubereats_backend_2021",
            url: "http://localhost:4000/graphql"
        }
    }
};
