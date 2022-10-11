import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: Parameters<typeof NextAuth>[2] = {
  providers: [
    CredentialsProvider({
      name: 'Account',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username...' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        /** Todo */
        if (credentials?.username === 'test' && credentials?.password === 'what') {
          const user: User = {
            id: '1',
            name: credentials?.username,
          }
          return user
        }
        console.info(credentials, _req)
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
}

export default NextAuth(authOptions)
