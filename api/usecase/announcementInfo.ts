import { getCurrentTime } from '@/core/utils'
import { Announcement } from '@/announcement'
import { AttendeeRole } from '@/attendee'
import { AnnouncementRepository, AttendeeRepository } from './repository'

type CreateAnnouncementRequest = Omit<Announcement, 'id' | 'announcedAt'> & {
  roles: string[]
}

export type AnnouncementReply = Omit<Announcement, 'id'>[]

const defaultQueryRole = AttendeeRole.Audience

export class AnnouncementInfo {
  private readonly announcementRepository: AnnouncementRepository
  private readonly attendeeRepository: AttendeeRepository

  constructor(
    announcementRepository: AnnouncementRepository,
    attendeeRepository: AttendeeRepository
  ) {
    this.announcementRepository = announcementRepository
    this.attendeeRepository = attendeeRepository
  }

  public async byAttendee(token?: string | undefined): Promise<AnnouncementReply> {
    const attendee = await this.attendeeRepository.findByToken(token ?? '')
    const results = await this.announcementRepository.listByRole(attendee?.role ?? defaultQueryRole)
    return results.map(toAnnouncementData)
  }

  public async create(params: CreateAnnouncementRequest): Promise<void> {
    await this.announcementRepository.create(toCreateAnnouncementParams(params))
  }
}

const toAnnouncementData = (data: {
  announcedAt: Date
  messageEn: string | null
  messageZh: string | null
  uri: string
}): Omit<Announcement, 'id'> => ({
  announcedAt: data.announcedAt,
  messageEn: data.messageEn,
  messageZh: data.messageZh,
  uri: data.uri,
})

const toCreateAnnouncementParams = (
  params: CreateAnnouncementRequest
): Omit<Announcement, 'id'> & { roles: string[] } => ({
  ...params,
  announcedAt: getCurrentTime(),
})
