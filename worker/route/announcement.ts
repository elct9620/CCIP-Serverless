import { IRequest } from 'itty-router'
import * as schema from '../../api/schema'
import { AnnouncementInfo, AnnouncementReply } from '../../api/usecase/announcementInfo'
import { datetimeToUnix } from '../../api/utils'
import { json } from './helper'

export type AnnouncementRequest = {
  announcementInfo: AnnouncementInfo
} & IRequest

export type AnnouncementResponse = schema.Announcement[]

export const announcement = async ({ announcementInfo }: AnnouncementRequest) => {
  const results = await announcementInfo.findByToken()
  return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
}

function toFormattedAnnouncement(data: AnnouncementReply[number]) {
  return {
    datetime: datetimeToUnix(data.announcedAt),
    msgEn: data.messageEn,
    msgZh: data.messageZh,
    uri: data.uri
  }
}
