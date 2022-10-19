import { signIn } from 'next-auth/react'
import * as React from 'react'
import cls from 'classnames'
import { useSession } from 'next-auth/react'
import { FaInfoCircle, FaQuestionCircle, FaSpinner } from 'react-icons/fa'
import { Fathom, EVENTS } from '~/components/hooks/useFathom'

export default function Auth({ fathom }: { fathom: Fathom }) {
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
      {type === 'signin' ? <SigninForm fathom={fathom} /> : <RegisterForm fathom={fathom} />}
    </div>
  )
}

function SigninForm({ fathom }: { fathom: Fathom }) {
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        try {
          e.preventDefault()
          setLoading(true)
          const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement | null)?.value.trim()
          const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement | null)?.value.trim()
          const result = await signIn('credentials', { redirect: false, username, password, type: 'signin' })
          fathom.trackGoal(EVENTS.Signin, 0)
          if (result?.ok) {
            window.location.replace('/')
          } else {
            setError(true)
          }
        } catch (e) {
          setError(true)
        } finally {
          setLoading(false)
        }
      }}
    >
      <h1 className="gwfont text-3xl text-center">Sign In</h1>
      <label className="flex flex-row gap-1 items-center justify-center">
        <span className="w-1/2 px-2">Username</span>
        <input
          className="text-black px-2 py-1 rounded-md"
          name="username"
          type="text"
          placeholder="Username..."
          required
        />
      </label>
      <label className="flex flex-row gap-1 items-center justify-center">
        <span className="w-1/2 px-2">Password</span>
        <input
          className="text-black px-2 py-1 rounded-md"
          name="password"
          type="password"
          placeholder="Your password..."
          required
        />
      </label>
      <button
        disabled={loading}
        type="submit"
        className="flex flex-row justify-center items-center bg-black-brushed rounded-md px-2 py-1 gwfont mt-2"
      >
        {loading ? <FaSpinner className="animate-spin" /> : 'Sign In'}
      </button>
      {error ? (
        <div className="text-red-600 text-center text-sm gwfont pb-2">There was an error, please try again.</div>
      ) : null}
    </form>
  )
}

function RegisterForm({ fathom }: { fathom: Fathom }) {
  const [error, setError] = React.useState<boolean | string>(false)
  const [loading, setLoading] = React.useState(false)
  return (
    <form
      className="flex flex-col gap-2 max-w-xs"
      onSubmit={async (e) => {
        try {
          e.preventDefault()
          const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement | null)?.value.trim()
          const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement | null)?.value.trim()
          const confirmPassword = (
            e.currentTarget.elements.namedItem('confirmPassword') as HTMLInputElement | null
          )?.value.trim()
          const gw2Account = (e.currentTarget.elements.namedItem('gw2Account') as HTMLInputElement | null)?.value.trim()
          if (password !== confirmPassword) {
            setError("Passwords don't match, please check what you've entered")
            setLoading(false)
            return
          } else if (password && password.length < 8) {
            setError('Password too short, must be over 8 characters')
            setLoading(false)
            return
          }
          const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
            confirmPassword,
            gw2Account,
            type: 'register',
          })
          fathom.trackGoal(EVENTS.Register, 0)
          if (result?.ok) {
            window.location.replace('/')
          } else {
            setError(true)
          }
        } catch (e) {
          setError(true)
        } finally {
          setLoading(false)
        }
      }}
    >
      <h1 className="gwfont text-3xl text-center">Register</h1>
      <label className="flex flex-row gap-1 items-center justify-center">
        <span className="w-1/2 px-2">Username</span>
        <input
          className="text-black px-2 py-1 rounded-md"
          name="username"
          type="text"
          placeholder="Username..."
          required
          minLength={3}
        />
      </label>
      <label className="flex flex-row gap-1 items-center justify-center">
        <span className="w-1/2 px-2">GW2 Account</span>
        <input
          className="text-black px-2 py-1 rounded-md"
          name="gw2Account"
          type="text"
          placeholder="XXXX.1234..."
          pattern=".+\.[0-9]{4}"
        />
      </label>
      <span className="flex flex-row gap-2 justify-center items-center text-xs text-opacity-85 text-white text-center max-w-xs -mt-0.5">
        <FaInfoCircle /> XXXX.1234
      </span>
      <span className="flex flex-row gap-2 justify-center items-center text-xs text-opacity-85 text-white text-center max-w-xs -mt-1.5 mb-1">
        <FaQuestionCircle /> This is optional - used to send ranked games rewards
      </span>
      <label className="flex flex-row gap-1 items-center justify-center">
        <span className="w-1/2 px-2">Password</span>
        <input
          className="text-black px-2 py-1 rounded-md"
          name="password"
          type="password"
          placeholder="Secure password..."
          required
          minLength={8}
        />
      </label>
      <span className="flex flex-row gap-2 justify-center items-center text-xs text-opacity-85 text-white text-center max-w-xs -mt-1 mb-1">
        <FaInfoCircle /> Minimum length 8 characters
      </span>
      <label className="flex flex-row gap-1 items-center justify-center">
        <span className="w-1/2 px-2">Repeat Password</span>
        <input
          className="text-black px-2 py-1 rounded-md"
          name="confirmPassword"
          type="password"
          placeholder="Repeat password..."
          required
          minLength={8}
        />
      </label>
      <button
        disabled={loading}
        type="submit"
        className="flex flex-row justify-center items-center bg-black-brushed rounded-md px-2 py-1 gwfont mt-2"
      >
        {loading ? <FaSpinner className="animate-spin" /> : 'Register'}
      </button>
      {error ? (
        <div className="text-red-600 text-center text-sm gwfont pb-2">
          {typeof error === 'string' ? error : 'There was an error, please try again.'}
        </div>
      ) : null}
    </form>
  )
}
