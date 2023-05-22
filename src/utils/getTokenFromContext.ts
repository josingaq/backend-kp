import { type MyContext } from '../types/index'

export const getTokenFromContext = (authorization: string): MyContext => {
  let token = authorization?.split(' ')[1]

  token = token !== undefined && token.trim() !== '' ? token : ''

  return {
    token
  }
}
