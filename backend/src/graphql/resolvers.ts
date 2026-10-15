/**
 * GraphQL resolvers placeholder — implemented in a later phase.
 */

export const resolvers: { Query: { _health: () => string } } = {
  Query: {
    // Minimal query so the GraphQL schema is valid; returns "ok" when reachable.
    _health: (): string => "ok",
  },
};

export default resolvers;
