import mongoose, { Schema, Model } from 'mongoose'
import { WithDoc, Game } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<WithDoc<Game>> {}

const itemSchema = new Schema<WithDoc<Game>, ItemModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    challengeType: {
      type: String,
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
    },
    totalScore: {
      type: Number,
      required: true,
    },
    isDeleted: Boolean,
  },
  {
    id: true,
    timestamps: true,
  }
)

const Item = mongoose.models.Game || mongoose.model<WithDoc<Game>, ItemModel>('Game', itemSchema)

export default Item
