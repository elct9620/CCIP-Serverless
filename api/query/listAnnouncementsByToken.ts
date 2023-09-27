import { Projection, Query, Repository } from '@/core'
import { Announcement } from '@/announcement'
import { Attendee, AttendeeRole } from '@/attendee'
import { ListAnnouncementsInput } from '@api/projection'

export type GetAttendeeInput = {
  token: string
}

export type ListAnnouncementsOutput = {
  announcedAt: Date
  messageEn: string | null
  messageZh: string | null
  uri: string
  roles: string[]
}[]

const defaultQueryRole = AttendeeRole.Audience

export class ListAnnouncementsByToken implements Query<GetAttendeeInput, ListAnnouncementsOutput> {
  private readonly announcements: Projection<ListAnnouncementsInput, Announcement[]>
  private readonly attendees: Repository<Attendee>

  constructor(
    announcements: Projection<ListAnnouncementsInput, Announcement[]>,
    attendees: Repository<Attendee>
  ) {
    this.announcements = announcements
    this.attendees = attendees
  }

  public async execute({ token }: GetAttendeeInput): Promise<ListAnnouncementsOutput> {
    const attendee = await this.attendees.findById(token)
    const results =
      (await this.announcements.query({ role: attendee?.role ?? defaultQueryRole })) ?? []
    return results.map(result => ({
      announcedAt: result.announcedAt,
      messageEn: result.messageEn,
      messageZh: result.messageZh,
      uri: result.uri,
      roles: result.roles,
    }))
  }
}
