import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster'
  }
]

const resolvers = {
  Query: {
    books: async (parent, args, ctx, info) => {
      // console.log('context', ctx)
      return books
    },
    ping: async (parent, args, ctx, info) => {
      const { pong } = args
      await pubsub.publish('PING_PONG', { ping: pong })
      return 'pong'
    }
  },
  Subscription: {
    ping: {
      subscribe: (parent, args, ctx, info) => {
        return pubsub.asyncIterator('PING_PONG')
      }
    }
  }
}

export { resolvers }
