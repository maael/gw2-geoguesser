import mongoose, { Schema, Model } from 'mongoose'
import { WithDoc, Challenge } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<WithDoc<Challenge>> {}

const itemSchema = new Schema<WithDoc<Challenge>, ItemModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: String,
    options: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ChallengeOption',
      },
    ],
    isDeleted: Boolean,
  },
  {
    id: true,
    timestamps: true,
  }
)

const Item = mongoose.models.Challenge || mongoose.model<WithDoc<Challenge>, ItemModel>('Challenge', itemSchema)

export default Item
