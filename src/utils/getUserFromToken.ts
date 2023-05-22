import { type Rol, type User } from '@prisma/client'
import { prisma } from '../prisma/connection.js'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

// export const getUserFromToken = async (token: string): Promise<User> => {
//   const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
//   const user = await prisma.user.findUnique({
//     where: {
//       id: decoded.id
//     },
//     include: {
//       rol: true
//     }
//   })
//   return user
// }

// export const getUserFromToken = async (token: string): Promise<User> => {
//   const decoded = jwt.verify(
//     token,
//     process.env.JWT_SECRET as string
//   ) as JwtPayload
//   if (typeof decoded === 'string') {
//     throw new Error('Invalid token')
//   }
//   const user = await prisma.user.findUnique({
//     where: {
//       id: decoded.id
//     },
//     include: {
//       rol: true
//     }
//   })
//   return user
// }

export const getUserFromToken = async (
  token: string
): Promise<User & { rol: Rol }> => {
  try {
    if (token === '') {
      throw new GraphQLError('Token not found', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: {
            status: 401
          }
        }
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
      include: {
        rol: true
      }
    })

    if (user === null) {
      throw new GraphQLError('Token invalid', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: {
            status: 401
          }
        }
      })
    }

    return user
  } catch (error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: {
          status: 401
        }
      }
    })
  }
}
