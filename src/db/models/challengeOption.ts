import { Schema, Model } from 'mongoose'
import { connect } from '../mongo'
import { WithDoc, ChallengeOption } from '../../types'

const connection = connect()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<WithDoc<ChallengeOption>> {}

const itemSchema = new Schema<WithDoc<ChallengeOption>, ItemModel>(
  {
    image: String,
    location: [Number, Number],
  },
  {
    id: true,
  }
)

const Item = connection.model<WithDoc<ChallengeOption>, ItemModel>('ChallengeOption', itemSchema)

export default Item
