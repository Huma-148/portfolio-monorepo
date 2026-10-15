/**
 * Single import point for the GraphQL layer: the schema definition (SDL) and the
 * resolver map. The GraphQL server (wired in a later phase) imports both from
 * here, so it never depends on the internal file layout.
 */
export { typeDefs } from "./typeDefs";
export { resolvers } from "./resolvers";
