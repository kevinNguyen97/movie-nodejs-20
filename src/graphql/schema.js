const { buildSchema } = require('graphql');

const graphqlSchema = buildSchema(`

    type Avatar {
        id: Int!
        url: String!
        userId: Int!
        isActive: Boolean!
    }

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        dayOfBirth: String!
        email: String!
        phoneNumber: String!
        role: String!
        avatar: Avatar!
        avatars: [Avatar]!
    }

    input UserInput {
        firstName: String!
        lastName: String!
        dayOfBirth: String!
        email: String!
        password: String!
        phoneNumber: String!
    }

    type rootQuery {
        getAllUser: [User]!
        getUserById(id: Int): User!
    }

    type rootMutation {
        createUser(userInput: UserInput): User!
        updateUser(userInput: UserInput, id: Int): User!
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }
`);

module.exports = graphqlSchema;
