import { NextApiHandler } from 'next'
import { deleteSubmission, getSubmissions } from '~/scripts/util/gw2Mongo'

const submissionApi: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const submissions = await getSubmissions({ accepted: false })
    res.json({ data: submissions })
  } else if (req.method === 'DELETE') {
    await deleteSubmission({ id: req.query.id?.toString() })
    res.json({ ok: 1 })
  } else {
    res.status(501).json({ error: 'Not implemented' })
  }
}

export default submissionApi
