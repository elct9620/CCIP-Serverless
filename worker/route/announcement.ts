import { IRequest } from 'itty-router'
import * as schema from '../../api/schema'
import { AnnouncementInfo } from '../../api/usecase/announcementInfo'
import { json } from './helper'

export type AnnouncementRequest = {
  announcementInfo: AnnouncementInfo
} & IRequest

export type AnnouncementResponse = schema.Announcement[]

export const announcement = async ({ announcementInfo }: AnnouncementRequest) => {
  const results = await announcementInfo.findByToken()
  return json<AnnouncementResponse>(results)
}
