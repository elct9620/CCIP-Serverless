import { inject, injectable } from 'tsyringe'
import { Projection, Query, Repository } from '@/core'
import { Announcement, LocalizedText } from '@/announcement'
import { Attendee, AttendeeRole } from '@/attendee'
import { ListAnnouncementsInput } from '@api/projection'

export type GetAttendeeInput = {
  token: string
}

export type ListAnnouncementsOutput = {
  announcedAt: Date
  message: LocalizedText
  uri: string
  roles: string[]
}[]

const defaultQueryRole = AttendeeRole.Audience

@injectable()
export class ListAnnouncementsByToken implements Query<GetAttendeeInput, ListAnnouncementsOutput> {
  constructor(
    @inject('IAnnouncementProjection')
    private readonly announcements: Projection<ListAnnouncementsInput, Announcement[]>,
    @inject('IAttendeeRepository')
    private readonly attendees: Repository<Attendee>
  ) {}

  public async execute({ token }: GetAttendeeInput): Promise<ListAnnouncementsOutput> {
    const attendee = await this.attendees.findById(token)
    const results =
      (await this.announcements.query({ role: attendee?.role ?? defaultQueryRole })) ?? []
    return results.map(result => ({
      announcedAt: result.announcedAt,
      message: result.message,
      uri: result.uri,
      roles: result.roles,
    }))
  }
}
