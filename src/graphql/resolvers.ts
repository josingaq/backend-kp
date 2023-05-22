import { PubSub } from 'graphql-subscriptions'
// import { prisma } from '../prisma/connection.js'
import { getUsers, createUser, signIn } from '../resolvers/user.js'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

const pubsub = new PubSub()

const resolvers = {
  Query: {
    signIn,
    getUsers,
    ping: async (parent: any, args: { pong: string }, ctx: any, info: any) => {
      const { pong } = args
      await pubsub.publish('PING_PONG', { ping: pong })
      return 'pong'
    }
  },
  Mutation: {
    createUser
  },
  Subscription: {
    ping: {
      subscribe: (parent: any, args: any, ctx: any, info: any) => {
        // console.log('context', ctx)
        return pubsub.asyncIterator('PING_PONG')
      },
      resolve: (payload: { ping: string }) => {
        const { ping } = payload
        return ping
      }
    }
  }
}

export { resolvers }
