import Link from 'next/link'

const messageToTypeMap = {
  'Need to have an account to play ranked games!': 'account',
  'Ranked games can only be done once per user!': 'attempts',
}
const contentMap = {
  account: AccountError,
  attempts: AttemptsError,
  default: DefaultError,
}

function AccountError({ error }: { error: string }) {
  return (
    <div className="text-white text-center text-2xl flex flex-col justify-center items-center gap-5 mt-5 h-full">
      <div>{error}</div>
      <div className="flex flex-row">
        <Link href="/auth">
          <a className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-5 py-1 hover:scale-110 transition-transform drop-shadow-lg h-full">
            Log in or Sign up here!
          </a>
        </Link>
      </div>
    </div>
  )
}

function AttemptsError({ error }: { error: string }) {
  return (
    <div className="text-white text-center text-2xl flex flex-col justify-center items-center gap-5 mt-5 h-full">
      <div>{error}</div>
      <div className="flex flex-row">
        <Link href="/">
          <a className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-5 py-1 hover:scale-110 transition-transform drop-shadow-lg h-full">
            Go back and find another game!
          </a>
        </Link>
      </div>
    </div>
  )
}

function DefaultError({ error }: { error: string }) {
  return (
    <>
      <div className="text-white text-center text-2xl mt-5 h-full">{error}</div>
    </>
  )
}

export default function ErrorScreen({ error }: { error: string }) {
  const type = messageToTypeMap[error]
  const Component = contentMap[type] || contentMap.default
  return <Component error={error} />
}
