import { Schema, Model } from 'mongoose'
import { connect } from '../mongo'
import { WithDoc, Challenge } from '../../types'

const connection = connect()

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
    createdAt: String,
    updatedAt: String,
  },
  {
    id: true,
    timestamps: true,
  }
)

const Item = connection.model<WithDoc<Challenge>, ItemModel>('Challenge', itemSchema)

export default Item
