import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { createServer } from 'http'
import express from 'express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import bodyParser from 'body-parser'
import cors from 'cors'

import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'

import { type MyContext } from './types/index'
import { getTokenFromContext } from './utils/getTokenFromContext.js'

import * as dotenv from 'dotenv'

dotenv.config()

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()

const httpServer = createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})

const serverCleanup = useServer(
  {
    schema,
    // context for subscriptions
    context: async (ctx, msg, args) => {
      return getTokenFromContext(ctx.connectionParams?.Authorization as string)
    },
    // As before, ctx is the graphql-ws Context where connectionParams live.
    onConnect: async (ctx) => {
      console.log('Connected!')
      // validate token ctx.connectionParams?.Authorization
      // throw new Error('Auth token missing!');
    },
    onDisconnect (ctx, code, reason) {
      console.log('Disconnected!')
    }
  },
  wsServer
)

const server = new ApolloServer<MyContext>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart () {
        return {
          async drainServer () {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
})

await server.start()

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    // context for queries and mutations
    context: async ({ req, res }) => {
      return getTokenFromContext(req.headers?.authorization as string)
    }
  })
)

const PORT = process.env.PORT ?? '4000'

httpServer.listen(PORT, () => {
  console.log(`🚀 Endpoint running on http://localhost:${PORT}/graphql`)
  console.log(`🚀 Subscription running on ws://localhost:${PORT}/graphql`)
})
