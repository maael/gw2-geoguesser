import { NextApiHandler } from 'next'
import functionsMap from '~/api/functions'
import dbConnect from '~/db/mongo'

const handler: NextApiHandler = async (req, res) => {
  const [type, id] = (req.query as any).route || []
  const { limit, page, offset, sort } = req.query
  if (!req.method) return
  if (req.method === 'OPTIONS') {
    res.json({ ok: 1 })
    return
  }
  const matchedFunction = ((functionsMap[type] || {})[req.method.toLowerCase()] || {})[id ? 'one' : 'many']
  console.info({
    type,
    id,
    method: req.method.toLowerCase(),
  })
  if (!matchedFunction) {
    res.status(501).json({ error: 'Not implemented', type, method: req.method.toLowerCase(), id })
    return
  }
  try {
    await dbConnect()
    const results = await matchedFunction({ id, limit, page, offset, body: req.body || {}, req, res, sort })
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export default handler
