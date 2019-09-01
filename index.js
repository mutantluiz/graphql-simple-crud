const { ApolloServer, gql } = require('apollo-server')
const uuid = require('uuid/v4')

const typeDefs = gql`
    type Quote {
        id: ID!
        phrase: String!
        quotee: String
    }

    type Query {
        quotes: [Quote]
    }

    type Mutation {
        addQuote(phrase: String!, quotee: String): Quote
        editQuote(id: ID!, phrase: String, quotee: String): Quote
        deleteQuote(id: ID!): DeleteResponse
    }

    type DeleteResponse {
        ok: Boolean!
    }
`

const quotes = {}
const addQuote = quote => {
    const id = uuid()
    return quotes[id] = { ...quote, id }
}

addQuote({ phrase: "LH", quotee: "44"})
addQuote({ phrase: "VB", quotee: "77"})
addQuote({ phrase: "MV", quotee: "33"})

const resolvers = {
    Query: {
        quotes: () => Object.values(quotes)
    },
    Mutation: {
        addQuote: async (parent, quote) => {
            return addQuote(quote)
        },
        editQuote: async (parent, {id, ...quote}) => {
            if (!quotes[id]) {
                throw new Error("Quote doesn't exist")
            }

            quotes[id] = {
                ...quotes[id],
                ...quote,
            }

            return quotes[id]
        },
        deleteQuote: async (parent, { id }) => {
            const ok = Boolean(quotes[id])
            delete quotes[id]

            return { ok }
        },
    },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen()