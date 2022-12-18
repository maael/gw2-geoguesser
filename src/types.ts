import type { Document, ObjectId } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

export type WithDoc<T> = T & Document

export interface User {
  username: string
  password: string
  image: string
  gw2Account?: string
  style?: 'rainbow'
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Game {
  userId: ObjectId
  totalScore: number
  challengeType: CHALLENGE
  challenge?: ObjectId
  timeMs?: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Challenge {
  name: string
  type: CHALLENGE
  options: ObjectId[]
  settings?: {
    sort?: 'score-time' | 'score-created-at'
    rounds?: number
    roundTime?: number
    pictureTime?: number
  }
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  prizes: any
}

export interface ChallengeOption {
  id: string
  image: string
  location: [number, number]
  mapId: number
  author?: string
}

export type ApiOneHandler<T = any, Body = any> = (args: {
  id: string
  secondaryId?: string
  body?: Body
  req: NextApiRequest
  res: NextApiResponse
  sort?: string
  limit?: number
}) => Promise<T | null>

export type ApiManyHandler<T = any, Body = any> = (args: {
  limit?: number
  page?: number
  offset?: number
  body?: Body
  req: NextApiRequest
  res: NextApiResponse
  sort?: string
}) => Promise<T[]>

export type ApiHandlers = Record<
  string,
  Partial<Record<'get' | 'post' | 'put' | 'delete', Partial<{ one: ApiOneHandler; many: ApiManyHandler }>>>
>

export enum CHALLENGE {
  'random' = 'random',
  'daily' = 'daily',
  'weekly' = 'weekly',
  'monthly' = 'monthly',
  'custom' = 'custom',
}
