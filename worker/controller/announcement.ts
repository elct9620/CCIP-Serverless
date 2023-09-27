import { IRequest } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { AnnouncementInfo } from '@api/command'
import { ListAnnouncementsByToken } from '@api/query'
import { datetimeToUnix } from '@api/utils'
import { get, post } from '@worker/router'

export type AnnouncementRequest = {
  listAnnouncementsByToken: ListAnnouncementsByToken
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
    const results = await request.listAnnouncementsByToken.execute({ token: String(request.query.token) })
    return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
  }

  @post('/announcement')
  async createAnnouncement(request: AnnouncementRequest) {
    const params = await new Response(request.body).json<Record<string, unknown>>()
    await request.announcementInfo.create(params)
    return json({ status: 'OK' })
  }
}
