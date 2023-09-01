import { IRequest } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { AnnouncementInfo } from '@api/usecase'
import { datetimeToUnix } from '@api/utils'

export type AnnouncementRequest = {
  announcementInfo: AnnouncementInfo
  query: Record<string, string | undefined>
} & IRequest

export type AnnouncementData = {
  datetime: number
  msgEn: string | null
  msgZh: string | null
  uri: string
}

export type AnnouncementResponse = AnnouncementData[]

export const createAnnouncement = async (request: AnnouncementRequest) => json({ status: 'OK' })

export const listAnnouncements = async ({ announcementInfo, query }: AnnouncementRequest) => {
  const results = await announcementInfo.byAttendee(query.token)
  return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
}

const toFormattedAnnouncement = (data: schema.Announcement): AnnouncementData => ({
  datetime: datetimeToUnix(data.announcedAt),
  msgEn: data.messageEn,
  msgZh: data.messageZh,
  uri: data.uri,
})
