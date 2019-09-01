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
`

const quotes = {}
const addQuotes = quote => {
    const id = uuid()
    return quotes[id] = { ...quote, id }
}

addQuotes({ phrase: "X", quotee: "x"})
addQuotes({ phrase: "Y", quotee: "y"})
addQuotes({ phrase: "W", quotee: "w"})

const resolvers = {
    Query: {
        quotes: () => Object.values(quotes)
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then( ({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
} )