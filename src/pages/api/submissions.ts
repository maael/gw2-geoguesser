import { NextApiHandler } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { deleteSubmissions, getSubmissions, approveSubmission } from '~/scripts/util/gw2Mongo'
import { authOptions } from '~/pages/api/auth/[...nextauth]'

const submissionApi: NextApiHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session || session?.user?.name !== 'Mael') {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  console.info('[submission]', req.method, req.query.id?.toString())
  if (req.method === 'GET') {
    const submissions = await getSubmissions({ accepted: false })
    res.json({ data: submissions })
  } else if (req.method === 'PUT') {
    await approveSubmission({ id: req.query.id?.toString() })
    res.json({ ok: 1 })
  } else if (req.method === 'DELETE') {
    await deleteSubmissions({ ids: (req.query.ids?.toString() || '').split(',').filter(Boolean) })
    res.json({ ok: 1 })
  } else {
    res.status(501).json({ error: 'Not implemented' })
  }
}

export default submissionApi
