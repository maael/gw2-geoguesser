import { signIn } from 'next-auth/react'
import * as React from 'react'
import cls from 'classnames'
import { useSession } from 'next-auth/react'

export default function Auth() {
  const { data: session } = useSession()
  React.useEffect(() => {
    if (session) {
      window.location.replace('/')
    }
  }, [session])
  const [type, setType] = React.useState('signin')
  return (
    <div className="bg-brown-brushed max-w-2xl mx-auto flex flex-col gap-2 text-white px-10 pt-5 pb-7 mt-10 drop-shadow-xl">
      <div className="flex flex-row mx-auto rounded-lg overflow-hidden gwfont">
        <button
          onClick={() => setType('signin')}
          className={cls('px-4 py-1 bg-black-brushed hover:opacity-100', { 'opacity-70': type !== 'signin' })}
        >
          Sign In
        </button>
        <button
          onClick={() => setType('register')}
          className={cls('px-2 py-1 bg-black-brushed hover:opacity-100', { 'opacity-70': type !== 'register' })}
        >
          Register
        </button>
      </div>
      {type === 'signin' ? <SigninForm /> : <RegisterForm />}
    </div>
  )
}

function SigninForm() {
  const [error, setError] = React.useState(false)
  return (
    <form
      className="flex flex-col gap-2 "
      onSubmit={async (e) => {
        e.preventDefault()
        const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement | null)?.value.trim()
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement | null)?.value.trim()
        const result = await signIn('credentials', { redirect: false, username, password, type: 'signin' })
        if (result?.ok) {
          window.location.replace('/')
        } else {
          setError(true)
        }
      }}
    >
      <h1 className="gwfont text-3xl text-center">Sign In</h1>
      <label className="flex flex-row gap-1 items-center justify-center">
        Username
        <input className="text-black px-2 py-1 rounded-md" name="username" type="text" />
      </label>
      <label className="flex flex-row gap-1 items-center justify-center">
        Password
        <input className="text-black px-2 py-1 rounded-md" name="password" type="password" />
      </label>
      <button type="submit">Sign in</button>
      {error ? (
        <div className="text-red-600 text-center text-sm gwfont pb-2">There was an error, please try again.</div>
      ) : null}
    </form>
  )
}

function RegisterForm() {
  const [error, setError] = React.useState(false)
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement | null)?.value.trim()
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement | null)?.value.trim()
        const confirmPassword = (
          e.currentTarget.elements.namedItem('password') as HTMLInputElement | null
        )?.value.trim()
        const result = await signIn('credentials', {
          redirect: false,
          username,
          password,
          confirmPassword,
          type: 'register',
        })
        if (result?.ok) {
          window.location.replace('/')
        } else {
          setError(true)
        }
      }}
    >
      <h1 className="gwfont text-3xl text-center">Register</h1>
      <label className="flex flex-row gap-1 items-center justify-center">
        Username
        <input className="text-black px-2 py-1 rounded-md" name="username" type="text" />
      </label>
      <label className="flex flex-row gap-1 items-center justify-center">
        Password
        <input className="text-black px-2 py-1 rounded-md" name="password" type="password" />
      </label>
      <label className="flex flex-row gap-1 items-center justify-center">
        Confirm Password
        <input className="text-black px-2 py-1 rounded-md" name="confirmPassword" type="password" />
      </label>
      <button type="submit">Register</button>
      {error ? (
        <div className="text-red-600 text-center text-sm gwfont pb-2">There was an error, please try again.</div>
      ) : null}
    </form>
  )
}
