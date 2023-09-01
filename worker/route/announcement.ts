import { IRequest } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { AnnouncementInfo } from '@api/usecase'
import { datetimeToUnix } from '@api/utils'
import { get, post } from '@worker/router'

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

const toFormattedAnnouncement = (data: schema.Announcement): AnnouncementData => ({
  datetime: datetimeToUnix(data.announcedAt),
  msgEn: data.messageEn,
  msgZh: data.messageZh,
  uri: data.uri,
})

export class AnnouncementController {
  @get('/announcement')
  async listAnnouncements(request: AnnouncementRequest) {
    const results = await request.announcementInfo.byAttendee(request.query.token)
    return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
  }

  @post('/announcement')
  async createAnnouncement(request: AnnouncementRequest) {
    return json({ status: 'OK' })
  }
}
