import { Document, ObjectId } from 'mongoose'

export type WithDoc<T> = T & Document

export interface User {
  username: string
  hash: string
  salt: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Game {
  userId: ObjectId
  guesses: GameGuess[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface GameGuess {
  id: string
  guess: [number, number]
  score: number
}

export interface Challenge {
  name: string
  rounds: number
  options: ChallengeOption[]
  authorId: ObjectId
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface ChallengeOption {
  id: string
  image: string
  location: [number, number]
}
