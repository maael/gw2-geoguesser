import { Schema, Model, PaginateModel } from 'mongoose'
import { connect } from '../mongo'
import { WithDoc, Challenge } from '../../types'

const connection = connect()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<WithDoc<Challenge>> {}

const itemSchema = new Schema<WithDoc<Challenge>, ItemModel>(
  {
    name: String,
    rounds: Number,
    options: [
      {
        id: String,
        image: String,
        location: [Number, Number],
      },
    ],
    authorId: Schema.Types.ObjectId,
    isDeleted: Boolean,
    createdAt: String,
    updatedAt: String,
  },
  {
    timestamps: true,
  }
)

const Item = connection.model<WithDoc<Challenge>, PaginateModel<ItemModel>>('Challenge', itemSchema)

export default Item
