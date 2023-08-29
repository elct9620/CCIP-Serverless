import { Announcement } from '../../src/announcement'
import { AnnouncementRepository } from './repository'

export type AnnouncementReply = Announcement[]

export class AnnouncementInfo {
  private readonly announcementRepository: AnnouncementRepository

  constructor(announcementRepository: AnnouncementRepository) {
    this.announcementRepository = announcementRepository
  }

  public async findByToken(token?: string): Promise<AnnouncementReply> {
    const results = await this.announcementRepository.findByToken(token)
    return results
  }
}
