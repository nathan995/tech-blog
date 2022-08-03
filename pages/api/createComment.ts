// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sanityClient from '@sanity/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT,
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2021-08-31',
}
const client = sanityClient(config)
export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body)
  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      approved: true,
      comment,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Couldn't submit comment", err })
  }
  console.log('done')
  return res.status(200).json({ message: 'Comment submitted' })
}
