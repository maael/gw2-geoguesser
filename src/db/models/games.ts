import { Schema, Model, PaginateModel } from 'mongoose'
import { connect } from '../mongo'
import { WithDoc, Game } from '../../types'

const connection = connect()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<WithDoc<Game>> {}

const itemSchema = new Schema<WithDoc<Game>, ItemModel>(
  {
    userId: Schema.Types.ObjectId,
    guesses: [
      {
        id: String,
        guess: [Number, Number],
        score: Number,
      },
    ],
    isDeleted: Boolean,
    createdAt: String,
    updatedAt: String,
  },
  {
    timestamps: true,
  }
)

const Item = connection.model<WithDoc<Game>, PaginateModel<ItemModel>>('Game', itemSchema)

export default Item
