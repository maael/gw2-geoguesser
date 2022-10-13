import type { Document, ObjectId } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

export type WithDoc<T> = T & Document

export interface User {
  username: string
  password: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Game {
  userId: ObjectId
  totalScore: number
  challengeType: CHALLENGE
  challenge?: ObjectId
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Challenge {
  name: string
  type: CHALLENGE
  options: [ObjectId]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface ChallengeOption {
  id: string
  image: string
  location: [number, number]
}

export type ApiOneHandler<T = any, Body = any> = (args: {
  id: string
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
}
