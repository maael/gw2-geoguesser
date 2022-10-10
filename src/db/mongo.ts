/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

let connection: mongoose.Connection

export function connect() {
  if (connection) return connection
  console.info('[new connection]')
  connection = mongoose.createConnection(process.env.MONGO_DB_URI!, {})

  connection.plugin(paginate)

  return connection
}
