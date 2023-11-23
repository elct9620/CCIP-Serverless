import { IRequest } from 'itty-router'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import * as Command from '@api/command'
import { ListAnnouncementsByToken } from '@api/query'
import { datetimeToUnix } from '@api/utils'
import { Get, Post } from '@worker/router'

export type AnnouncementRequest = {
  listAnnouncementsByToken: ListAnnouncementsByToken
  createAnnouncementCommand: Command.CreateAnnouncement
  query: Record<string, string | undefined>
} & IRequest

export type AnnouncementData = {
  datetime: number
  msgEn: string | null
  msgZh: string | null
  uri: string
}

const toCreateAnnouncementParams = (
  data: schema.CreateAnnouncementPayload
): Command.CreateAnnouncementInput => {
  return {
    message: {
      ...(typeof data.msg_en === 'string' && { [schema.Languages.enUS]: data.msg_en }),
      ...(typeof data.msg_zh === 'string' && { [schema.Languages.zhTW]: data.msg_zh }),
    },
    uri: typeof data.uri === 'string' ? data.uri : '',
    roles: Array.isArray(data.role) ? data.role : [],
  }
}

export type AnnouncementResponse = AnnouncementData[]

const toFormattedAnnouncement = (data: schema.Announcement): AnnouncementData => ({
  datetime: datetimeToUnix(data.announcedAt),
  msgEn: data.message[schema.Languages.enUS],
  msgZh: data.message[schema.Languages.zhTW],
  uri: data.uri,
})

@Get('/announcement')
export class ListAnnouncement extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'List announcements',
    tags: ['Announcement'],
    parameters: {
      token: schema.OptionalAttendeeTokenQuery,
    },
  }

  async handle(request: AnnouncementRequest) {
    const results = await request.listAnnouncementsByToken.execute({
      token: String(request.query.token),
    })
    return json<AnnouncementResponse>(results.map(toFormattedAnnouncement))
  }
}

@Post('/announcement')
export class CreateAnnouncement extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Create an announcement',
    tags: ['Announcement'],
  }

  async handle(request: AnnouncementRequest) {
    const params = await request.json<schema.CreateAnnouncementPayload>()
    await request.createAnnouncementCommand.execute(toCreateAnnouncementParams(params))
    return json({ status: 'OK' })
  }
}
