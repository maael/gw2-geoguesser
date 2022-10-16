import mongoose from 'mongoose'

export async function getItems() {
  const db = await mongoose.createConnection(`${process.env.GW2_SIGHTSEEING_MONGO_DB_URI}`)

  const Group = new mongoose.Schema({
    items: [mongoose.Schema.Types.ObjectId],
  })

  const GroupModel = db.model('Group', Group)

  const geoGuesserGroup = await GroupModel.findById('6349583708b51df54311c4a1', { items: 1 }).lean()

  if (!geoGuesserGroup) throw new Error('Failed to find geo guesser group')

  const Item = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: false,
      },
      precision: {
        type: Number,
        default: 5,
      },
      position: {
        type: [Number],
        default: [0, 0, 0],
      },
      metadata: {
        type: mongoose.Schema.Types.Mixed,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    },
    {
      id: true,
    }
  )

  const ItemModel = db.model('Item', Item)

  const items = await ItemModel.find({ _id: { $in: geoGuesserGroup.items } }).lean()

  console.info('[Found]', { items: items.length })

  return items.map((i) => {
    return {
      image: i.imageUrl?.replace(
        'https://s3.us-west-2.amazonaws.com/gw2-sightseeing.maael.xyz/',
        'https://gw2-sightseeing.maael.xyz/'
      ),
      location: i.metadata?.geocoords,
      mapId: i.metadata?.mapId,
    }
  })
}
