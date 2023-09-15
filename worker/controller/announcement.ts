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

export type AnnouncementPayload = {
  msg_en: string | null
  msg_zh: string | null
  uri: string
  role: string | string[]
}

const toFormattedAnnouncement = (data: schema.Announcement): AnnouncementData => ({
  datetime: datetimeToUnix(data.announcedAt),
  msgEn: data.messageEn,
  msgZh: data.messageZh,
  uri: data.uri,
})

const toCreateAnnouncementParams = (data: AnnouncementPayload): schema.CreateAnnouncementParams => {
  let roles: string[]
  try {
    if (Array.isArray(data.role)) {
      roles = data.role.map(String)
    } else {
      const parsed = JSON.parse(data.role)
      roles = Array.isArray(parsed) ? parsed.map(String) : []
    }
  } catch {
    roles = []
  }

  return {
    messageEn: typeof data.msg_en === 'string' ? data.msg_en : null,
    messageZh: typeof data.msg_zh === 'string' ? data.msg_zh : null,
    uri: typeof data.uri === 'string' ? data.uri : '',
    roles
  }
}

export class AnnouncementController {
  @get('/announcement')
  async listAnnouncements(request: AnnouncementRequest) {
    const results = await request.announcementInfo.byAttendee(request.query.token)
    return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
  }

  @post('/announcement')
  async createAnnouncement(request: AnnouncementRequest) {
    const params = await new Response(request.body).json<AnnouncementPayload>()
    await request.announcementInfo.create(toCreateAnnouncementParams(params))
    return json({ status: 'OK' })
  }
}
