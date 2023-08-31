import { AttendeeRole } from '@/attendee'
import { Announcement } from '../schema'
import { AnnouncementRepository, AttendeeRepository } from './repository'

export type AnnouncementReply = Announcement[]

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

  public async listAllByToken(token?: string | undefined): Promise<AnnouncementReply> {
    let attendeeRole = defaultQueryRole
    if (token) {
      await this.attendeeRepository.findByToken(token).then(attendee => {
        if (attendee?.role) {
          attendeeRole = attendee.role
        }
      })
    }

    const results = await this.announcementRepository.listAllByRole(attendeeRole)
    return results.map(toAnnouncementData)
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
