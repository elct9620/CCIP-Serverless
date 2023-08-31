import { Announcement } from '../schema'
import { AnnouncementRepository } from './repository'

export type AnnouncementReply = Announcement[]

export class AnnouncementInfo {
  private readonly announcementRepository: AnnouncementRepository

  constructor(announcementRepository: AnnouncementRepository) {
    this.announcementRepository = announcementRepository
  }

  public async listAllByToken(token?: string | undefined): Promise<AnnouncementReply> {
    const role = !!token ? 'staff' : 'audience'
    const results = await this.announcementRepository.listAllByRole(role)
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
