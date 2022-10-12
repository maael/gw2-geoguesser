import { Schema, Model } from 'mongoose'
import bcrypt from 'bcrypt'
import { connect } from '../mongo'
import { WithDoc, User } from '../../types'

const connection = connect()

interface ItemMethods {
  comparePassword(input: string): Promise<boolean>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/ban-types
type ItemModel = Model<WithDoc<User>, {}, ItemMethods>

const itemSchema = new Schema<WithDoc<User>, ItemModel, ItemMethods>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: String,
    updatedAt: String,
  },
  {
    timestamps: true,
  }
)

itemSchema.pre('save', function preSave(next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: WithDoc<User> = this as any
  if (!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (err, result) => {
      if (err) return next(err)
      user.password = result
      next()
    })
  })
})

itemSchema.methods.comparePassword = async function comparePassword(input) {
  const userPassword = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(input, userPassword, function compare(err, isMatch) {
      if (err) return reject(err)
      resolve(isMatch)
    })
  })
}

const Item = connection.model<WithDoc<User>, ItemModel>('User', itemSchema)

export default Item
