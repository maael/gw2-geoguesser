import { Schema, Model, PaginateModel } from 'mongoose'
import { connect } from '../mongo'
import { WithDoc, User } from '../../types'

const connection = connect()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<WithDoc<User>> {}

const itemSchema = new Schema<WithDoc<User>, ItemModel>(
  {
    username: String,
    hash: String,
    salt: String,
    isDeleted: Boolean,
    createdAt: String,
    updatedAt: String,
  },
  {
    timestamps: true,
  }
)

const Item = connection.model<WithDoc<User>, PaginateModel<ItemModel>>('User', itemSchema)

export default Item
