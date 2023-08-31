import { IRequest } from 'itty-router'
import * as schema from '@api/schema'
import { AnnouncementInfo } from '@api/usecase'
import { datetimeToUnix } from '@api/utils'
import { json } from './helper'

export type AnnouncementRequest = {
  announcementInfo: AnnouncementInfo
} & IRequest

export type AnnouncementData = {
  datetime: number
  msgEn: string | null
  msgZh: string | null
  uri: string
}

export type AnnouncementResponse = AnnouncementData[]

export const announcement = async ({ announcementInfo }: AnnouncementRequest) => {
  const results = await announcementInfo.listAll();
  return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
}

const toFormattedAnnouncement = (data: schema.Announcement): AnnouncementData => ({
  datetime: datetimeToUnix(data.announcedAt),
  msgEn: data.messageEn,
  msgZh: data.messageZh,
  uri: data.uri,
})
