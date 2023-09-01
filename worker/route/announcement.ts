import { IRequest } from 'itty-router'
import * as schema from '@api/schema'
import { AnnouncementInfo } from '@api/usecase'
import { datetimeToUnix } from '@api/utils'
import { json } from './helper'

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

const createAnnouncement = async (request: AnnouncementRequest) => json({ status: 'OK' })

const listAnnouncements = async ({ announcementInfo, query }: AnnouncementRequest) => {
  const results = await announcementInfo.byAttendee(query.token)
  return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
}

export const announcement = async (request: AnnouncementRequest) => {
  if (request.method.toUpperCase() === 'POST') {
    return createAnnouncement(request)
  } else {
    return listAnnouncements(request)
  }
}

const toFormattedAnnouncement = (data: schema.Announcement): AnnouncementData => ({
  datetime: datetimeToUnix(data.announcedAt),
  msgEn: data.messageEn,
  msgZh: data.messageZh,
  uri: data.uri,
})
