import { prisma } from '../prisma/connection.js'
import { type MyContext } from '../types/index'
import { type User } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { encryptPassword } from '../utils/encryptPassword.js'
import { getUserFromToken } from '../utils/getUserFromToken.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getUsers = async (
  parent: any,
  args: any,
  ctx: MyContext,
  info: any
): Promise<User[]> => {
  const loggedUser = await getUserFromToken(ctx.token ?? '')

  if (loggedUser.rol.name !== 'Administrador') {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: {
          status: 401
        }
      }
    })
  }

  const allUsers = await prisma.user.findMany({
    include: {
      rol: true
    }
  })

  return allUsers
}

export const createUser = async (
  parent: any,
  args: { input: User },
  ctx: MyContext,
  info: any
): Promise<User> => {
  const loggedUser = await getUserFromToken(ctx.token ?? '')

  if (loggedUser.rol.name !== 'Administrador') {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: {
          status: 401
        }
      }
    })
  }

  const { input } = args

  const existsEmail = await prisma.user.findUnique({
    where: {
      email: input.email
    }
  })

  if (existsEmail != null) {
    // throw new Error('Email already exists')
    throw new GraphQLError('Email already exists', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'email',
        http: {
          status: 400
        }
      }
    })
  }

  const existsDni = await prisma.user.findUnique({
    where: {
      dni: input.dni
    }
  })

  if (existsDni != null) {
    // throw new Error('DNI already exists')
    throw new GraphQLError('DNI already exists', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'dni',
        http: {
          status: 400
        }
      }
    })
  }

  input.password = await encryptPassword(input.password)

  const newUser = await prisma.user.create({
    data: {
      ...input
    }
  })

  return newUser
}

export const signIn = async (
  parent: any,
  args: { email: string, password: string },
  ctx: any,
  info: any
): Promise<User & { token: string }> => {
  const { email, password } = args
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user == null) {
    throw new GraphQLError('Email not found', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'email',
        http: {
          status: 400
        }
      }
    })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new GraphQLError('Invalid password', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'password',
        http: {
          status: 400
        }
      }
    })
  }

  if (process.env.JWT_SECRET == null || process.env.JWT_SECRET === '') {
    // throw new Error('JWT secret not found')
    throw new GraphQLError('JWT secret not found', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500
        }
      }
    })
  }

  const payload = {
    id: user.id,
    email: user.email
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })

  return {
    ...user,
    token
  }
}
