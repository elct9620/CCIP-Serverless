import { Announcement as AnnouncementSchema } from '../schema'
import { AnnouncementRepository } from './repository'

export type AnnouncementReply = AnnouncementSchema[]

export class AnnouncementInfo {
  private readonly announcementRepository: AnnouncementRepository

  constructor(announcementRepository: AnnouncementRepository) {
    this.announcementRepository = announcementRepository
  }

  public async findByToken(token?: string): Promise<AnnouncementReply> {
    const results = await this.announcementRepository.findByToken(token)

    return results.map(result => ({
      datetime: result.announcedAt,
      msgEn: result.messageEn,
      msgZh: result.messageZh,
      uri: result.uri
    }))
  }
}
