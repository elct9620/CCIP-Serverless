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

type CreateAnnouncementParams = {
  messageEn: string | null
  messageZh: string | null
  uri: string
  roles: string[]
}

const toCreateAnnouncementParams = (
  data: schema.CreateAnnouncementPayload
): CreateAnnouncementParams => {
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
    roles,
  }
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
    const params = await request.json<schema.CreateAnnouncementPayload>()
    await request.announcementInfo.create(toCreateAnnouncementParams(params))
    return json({ status: 'OK' })
  }
}
