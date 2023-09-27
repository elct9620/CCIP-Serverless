import { Attendee, AttendeeRole } from '@/attendee'
import { Repository } from '@/core'
import { Announcement } from '@api/schema'
import { AnnouncementRepository } from './repository'

export type AnnouncementReply = Announcement[]

const defaultQueryRole = AttendeeRole.Audience

export class AnnouncementInfo {
  private readonly announcementRepository: AnnouncementRepository
  private readonly attendeeRepository: Repository<Attendee>

  constructor(
    announcementRepository: AnnouncementRepository,
    attendeeRepository: Repository<Attendee>
  ) {
    this.announcementRepository = announcementRepository
    this.attendeeRepository = attendeeRepository
  }

  public async byAttendee(token?: string | undefined): Promise<AnnouncementReply> {
    const attendee = await this.attendeeRepository.findById(token ?? '')
    const results = await this.announcementRepository.listByRole(attendee?.role ?? defaultQueryRole)
    return results.map(toAnnouncementData)
  }

  public async create(_params: Record<string, unknown>): Promise<void> {
    const fixedValue = {
      id: crypto.randomUUID(),
      announcedAt: new Date('2023-08-27 00:00:00 GMT+8').toISOString(),
      messageEn: 'hello world',
      messageZh: '世界你好',
      uri: 'https://testability.opass.app/announcements/1',
      roles: ['audience'],
    }
    await this.announcementRepository.create(fixedValue)
  }
}

const toAnnouncementData = (data: {
  announcedAt: Date
  messageEn: string | null
  messageZh: string | null
  uri: string
}): Announcement => ({
  announcedAt: data.announcedAt,
  messageEn: data.messageEn,
  messageZh: data.messageZh,
  uri: data.uri,
})
