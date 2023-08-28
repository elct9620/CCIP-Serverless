import { IRequest } from 'itty-router'
import { json } from './helper'

export type AnnouncementRequest = IRequest

// TODO
export type AnnouncementResponse = Object[]

// TODO
export const announcement = async ({ query }: AnnouncementRequest) => {
  return json<AnnouncementResponse>([])
}
