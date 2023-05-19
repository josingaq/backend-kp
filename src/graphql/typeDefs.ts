const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    ping(pong: String): String
  }

  type Subscription {
    ping: String
  }
`
export { typeDefs }
