import { Schema, Model } from 'mongoose'
import { connect } from '../mongo'
import { WithDoc, Game } from '../../types'

const connection = connect()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<WithDoc<Game>> {}

const itemSchema = new Schema<WithDoc<Game>, ItemModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    challenge: {
      type: String,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    isDeleted: Boolean,
    createdAt: String,
    updatedAt: String,
  },
  {
    id: true,
    timestamps: true,
  }
)

const Item = connection.model<WithDoc<Game>, ItemModel>('Game', itemSchema)

export default Item
