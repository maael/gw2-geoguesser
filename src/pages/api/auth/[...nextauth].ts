import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import UserModel from '~/db/models/user'
import { getRandomArrayItem } from '~/util'

export const authOptions: Parameters<typeof NextAuth>[2] = {
  providers: [
    CredentialsProvider({
      name: 'Account',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username...' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        const expandedCredentials = credentials as typeof credentials & { type: 'register' | 'signin' }
        if (expandedCredentials?.type === 'register') {
          return registerFlow(credentials)
        } else {
          return signinFlow(credentials)
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      if (session?.user) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(session.user as any).id = token.uid
      }
      console.info({ session, token, user })
      return session
    },
    jwt: async ({ user, token, profile, account }) => {
      if (user) {
        token.uid = user.id
      }
      console.info({ user, token, profile, account })
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
}

async function registerFlow(credentials: Record<'username' | 'password', string> | undefined): Promise<User | null> {
  return new Promise((resolve, reject) => {
    if (!credentials) return reject(new Error('Credentials required'))
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const avatars = require('../../../../data/avatars.json') as string[]
    const newUser = new UserModel({
      username: credentials.username,
      password: credentials.password,
      image: getRandomArrayItem(avatars),
    })
    newUser.save((err) => {
      if (err) return reject(err)
      resolve({
        id: newUser._id.toString(),
        name: newUser.username,
        image: newUser.image,
      })
    })
  })
}

async function signinFlow(credentials: Record<'username' | 'password', string> | undefined): Promise<User | null> {
  if (!credentials) throw new Error('Credentials required')
  const user = await UserModel.findOne({ username: credentials.username })
  if (!user) throw new Error('No user')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comparison = await (user as any).comparePassword(credentials.password)
  if (comparison) {
    return {
      id: user._id.toString(),
      name: user.username,
      image: user.image,
    }
  } else {
    return null
  }
}

export default NextAuth(authOptions)
