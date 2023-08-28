import { IRequest } from 'itty-router'
import { json } from './helper'

export type AnnouncementRequest = IRequest

export type AnnouncementResponse = Object[]

export const announcement = async ({ query }: AnnouncementRequest) => {
  return json<AnnouncementResponse>([])
}
