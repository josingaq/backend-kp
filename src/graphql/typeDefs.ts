const typeDefs = `#graphql
  type Rol {
    id:         ID!
    name:       String!
    createdAt:  String!
    updatedAt:  String!
  }

  type User {
    id:         ID!
    email:      String!
    dni:        String!
    name:       String!
    lastName:   String!
    address:    String!
    phone:      String!
    district:   String
    province:   String
    department: String
    country:    String
    rolId:      ID!
    rol:        Rol!
    token:      String
    createdAt:  String!
    updatedAt:  String!
  }

  input UserInput {
    email:      String!
    password:   String!
    dni:        String!
    name:       String!
    lastName:   String!
    address:    String!
    phone:      String!
    district:   String
    province:   String
    department: String
    country:    String
    rolId:      ID!
  }

  type Query {
    signIn(email: String!, password: String!): User!
    getUsers: [User!]!
    ping(pong: String): String
  }

  type Mutation {
    createUser(input: UserInput!): User!
  }

  type Subscription {
    ping: String
  }
`
export { typeDefs }
